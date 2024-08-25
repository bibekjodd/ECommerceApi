import { cancelOrderSchema, getOrdersSchema } from '@/dtos/order.dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException
} from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { Order } from '@/models/order.model';
import { Product, selectProductProperties } from '@/models/product.model';
import { selectUserProperties } from '@/models/user.model';
import { addNotification } from '@/services/notification.service';
import { updateSales } from '@/services/sales.service';

type UpdateOrderBody = {
  paid?: boolean;
  delivered?: boolean;
};
export const updateOrder = handleAsync<{ id: string }, unknown, UpdateOrderBody>(
  async (req, res) => {
    if (!req.user) throw new UnauthorizedException();

    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundException("Order doesn't exist");

    if (order.seller.toString() !== req.user._id.toString())
      throw new ForbiddenException('Only sellers can update the order status');

    if (order.status === 'cancelled' || order.status === 'delivered') {
      throw new ForbiddenException(`Order is already ${order.status}`);
    }

    const { paid, delivered } = req.body;
    if (paid === true) order.paid = true;
    if (delivered === true) {
      order.paid = true;
      order.deliveredAt = new Date();
      order.status = 'delivered';
      order.save();
    }

    if (!delivered) return res.json({ message: 'Order updated successfully' });

    const deliveryDays = new Date().getDate() - new Date(order.orderedAt).getDate();
    updateSales({
      deliveryDays,
      product: order.product._id.toString(),
      quantity: order.quantity,
      isCancelled: false,
      seller: order.seller.toString(),
      amount: order.totalPrice
    });

    const product = await Product.findById(order.product._id.toString());
    if (product) {
      addNotification({
        title: `Product - ${product.title} is delivered succesfully to ${order.address}`,
        user: order.user._id.toString()
      });
      addNotification({
        title: `Product - ${product.title} is delivered to user successfully`,
        user: req.user._id.toString()
      });
    }
    return res.json({ message: 'Order updated successfully' });
  }
);

export const cancelOrder = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const orderId = req.params.id;

  const { reason } = cancelOrderSchema.parse(req.body);
  const order = await Order.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');

  if (
    !(
      order.seller.toString() === req.user._id.toString() ||
      order.user.toString() === req.user._id.toString()
    )
  ) {
    throw new ForbiddenException('Only buyer or seller can cancel the order');
  }

  if (order.status === 'cancelled' || order.status === 'delivered')
    throw new BadRequestException(`Order is already ${order.status}`);

  const deliveryDays =
    new Date(new Date().toISOString()).getDate() - new Date(order.orderedAt).getDate();

  updateSales({
    amount: order.totalPrice,
    deliveryDays,
    product: order.product.toString(),
    quantity: order.quantity,
    seller: order.seller.toString(),
    isCancelled: true
  });

  order.status = 'cancelled';
  order.cancelReason = reason;
  order.save({ validateBeforeSave: true });

  Product.findByIdAndUpdate(order.product.toString(), {
    $inc: {
      stock: order.quantity
    }
  }).then((product) => {
    if (!product) return;
    addNotification({
      title: `Order for product ${product.title} is cancelled! ${reason}`,
      user: order.user.toString()
    });
    addNotification({
      title: `Order for product ${product.title} is cancelled`,
      user: order.seller.toString(),
      description: 'The cancelled stocks are added on inventory'
    });
  });

  return res.json({ message: 'Order cancelled successfully' });
});

export const getMyOrders = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const { limit, cursor } = getOrdersSchema.parse(req.query);

  const orders = await Order.find({
    user: req.user._id.toString(),
    orderedAt: { $lt: cursor }
  })
    .limit(limit)
    .populate([
      { path: 'product', select: selectProductProperties },
      { path: 'user', select: selectUserProperties },
      { path: 'seller', select: selectUserProperties }
    ])
    .sort({ orderedAt: 'desc' });

  return res.json({ orders });
});

export const getOrdersOnMyProducts = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const { limit, cursor } = getOrdersSchema.parse(req.query);

  const orders = await Order.find({
    seller: req.user._id.toString(),
    orderedAt: { $lt: cursor }
  })
    .limit(limit)
    .populate([
      { path: 'product', select: selectProductProperties },
      { path: 'user', select: selectUserProperties },
      { path: 'seller', select: selectUserProperties }
    ])
    .sort({ orderedAt: 'desc' });

  return res.json({ orders });
});
