import { addToCartSchema } from '@/dtos/cart.dto';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { Cart } from '@/models/cart.model';
import { Product, selectProductProperties } from '@/models/product.model';

export const addToCart = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const productId = req.params.id;
  const { quantity } = addToCartSchema.parse(req.body);
  const product = await Product.findById(productId);
  if (!product) throw new NotFoundException('Product does not exist');

  const totalItemsOnCart = await Cart.countDocuments({ user: req.user._id.toString() });
  if (totalItemsOnCart >= 10)
    throw new BadRequestException('You already have more than 10 items on the cart');

  await Cart.updateOne(
    { product: productId },
    { user: req.user._id.toString(), product: productId, quantity },
    { upsert: true }
  );

  return res.json({ message: 'Item added to cart successfully' });
});

export const getCartItems = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const result = await Cart.find({ user: req.user._id.toString() })
    .populate([{ path: 'product', select: selectProductProperties }])
    .lean();
  const items = result
    .filter((item) => !!item.product)
    .map((item) => ({ ...item, user: undefined }));
  return res.json({ items });
});

export const removeFromCart = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const productId = req.params.id;
  await Cart.deleteOne({ product: productId, user: req.user._id.toString() });
  return res.json({ message: 'Item removed from cart' });
});

export const clearCart = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  await Cart.deleteMany({ user: req.user._id.toString() });
  return res.json({ message: 'Cart cleared successfully' });
});
