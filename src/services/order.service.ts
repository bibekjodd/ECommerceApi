import { Cart } from '@/models/cart.model';
import { Order } from '@/models/order.model';
import { Product } from '@/models/product.model';
import { addNotification } from './notification.service';

type Products = { id: string; quantity: number }[];
type Address = Partial<{
  city: string | null;
  country: string | null;
  state: string | null;
  postalCode: string | null;
}>;
export const placeOrder = async ({
  products,
  userId,
  paid,
  paymentType,
  address,
  clearCart
}: {
  products: Products;
  userId: string;
  paid: boolean;
  paymentType: 'cash-on-delivery' | 'online';
  address: Address;
  clearCart: boolean;
}) => {
  const productIds = products.map((product) => product.id);
  const orderProducts = await Product.find({ _id: { $in: productIds } });
  const promises: Promise<unknown>[] = [];
  let promise: Promise<unknown>;
  orderProducts.forEach((currentProduct) => {
    const quantity = products.find((product) => product.id === currentProduct.id)?.quantity;
    if (!quantity) return;

    const price = currentProduct.price - (currentProduct.price * currentProduct.discountRate) / 100;
    const totalPrice = price * quantity;
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const estimatedDeliveryDate = new Date(Date.now() + SEVEN_DAYS).toISOString();
    currentProduct.stock -= quantity;

    promise = Order.create({
      address,
      paymentType,
      quantity,
      user: userId,
      product: currentProduct._id.toString(),
      seller: currentProduct.owner.toString(),
      totalPrice,
      estimatedDeliveryDate,
      orderedAt: new Date().toISOString(),
      paid,
      price
    });
    promises.push(promise);

    promise = currentProduct.save();
    promises.push(promise);

    promise = addNotification({
      title: `Product - ${currentProduct.title} has got order`,
      user: currentProduct.owner.toString(),
      description: 'You can track orders through dashboard'
    });
    promises.push(promise);

    promise = addNotification({
      title: `Order for currentProduct - ${currentProduct.title} placed successfully`,
      user: userId
    });
    promises.push(promise);
  });

  if (clearCart) {
    promise = Cart.deleteMany({ user: userId });
    promises.push(promise);
  }

  await Promise.all(promises);
  return;
};
