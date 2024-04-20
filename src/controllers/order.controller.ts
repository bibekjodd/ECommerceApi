import { getOrdersSchema } from '@/dtos/order.dto';
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

type PlaceOrderBody = {
  address: string;
  paymentType: string;
  quantity: number;
};
export const placeOrder = handleAsync<{ id: string }, unknown, PlaceOrderBody>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) throw new BadRequestException("Product doesn't exist");

  if (product.owner.toString() === req.user._id.toString())
    throw new ForbiddenException("You can't place order on your own product");

  const { address, paymentType, quantity } = req.body;

  if (product.stock < quantity)
    throw new BadRequestException(
      `Requested to place order for ${quantity} items but only ${product.stock} items are available`
    );

  const price = product.price - (product.price * product.discountRate) / 100;
  const totalPrice = price * quantity;
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const estimatedDeliveryDate = new Date(Date.now() + SEVEN_DAYS).toISOString();

  await Order.create({
    address,
    paymentType,
    quantity,
    user: req.user._id.toString(),
    product: productId,
    seller: product.owner.toString(),
    totalPrice,
    estimatedDeliveryDate,
    price: product.price
  });

  product.stock -= quantity;
  product.save();
  addNotification({
    title: `Product - ${product.title} has got order`,
    user: req.user._id.toString(),
    description: 'You can track order through dashboard'
  });
  addNotification({
    title: `Order for product - ${product.title} placed successfully`,
    user: req.user._id.toString()
  });
  return res.json({ message: 'Order placed successfully' });
});

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
    if (paid) order.paid = true;
    if (delivered) {
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
        title: `Product - ${product.title} is delivered succesfullly to ${order.address}`,
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
  order.save({ validateBeforeSave: true });

  Product.findByIdAndUpdate(order.product.toString(), {
    $inc: {
      stock: order.quantity
    }
  }).then((product) => {
    if (!product) return;
    addNotification({
      title: `Order for product ${product.title} is cancelled`,
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
    ]);

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
    ]);

  return res.json({ orders });
});
