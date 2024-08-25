import { env } from '@/config/env.config';
import { checkoutSchema } from '@/dtos/checkout.dto';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  UnauthorizedException
} from '@/lib/exceptions';
import { stripe } from '@/lib/stripe';
import { handleAsync } from '@/middlewares/handle-async';
import { Cart } from '@/models/cart.model';
import { CheckoutMetadata, createCheckoutSession } from '@/services/checkout.service';
import { placeOrder } from '@/services/order.service';

export const checkout = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const { successUrl, cancelUrl, product, cart } = checkoutSchema.parse(req.body);
  if (!cart && !product)
    throw new BadRequestException('Specify either cart items or product to checkout');

  let products: { id: string; quantity: number }[] = [];
  if (cart) {
    const cartItems = await Cart.find({ user: req.user._id.toString() });
    if (!cartItems.length) throw new BadRequestException('No items on the cart to checkout');
    products = cartItems.map((item) => ({
      id: item.product.toString(),
      quantity: item.quantity
    }));
  } else if (product) {
    products = [product];
  }
  if (!products)
    throw new BadRequestException('The requested products are not available for checkout');

  const { checkoutSession } = await createCheckoutSession({
    products,
    cancelUrl,
    successUrl,
    customerEmail: req.user.email,
    customerId: req.user._id.toString(),
    isCart: cart ? 'true' : 'false'
  });

  return res.json({ checkoutSessionId: checkoutSession.id });
});

export const webhookListener = handleAsync(async (req, res) => {
  if (!(req.body instanceof Buffer || typeof req.body === 'string')) {
    throw new ForbiddenException('Invalid body passed');
  }

  const stripeSignature = req.headers['stripe-signature'];
  if (!stripeSignature)
    throw new BadRequestException('Did not receive stripe-signature on headers');

  const event = await stripe.webhooks.constructEventAsync(
    req.body,
    stripeSignature,
    env.STRIPE_SECRET_WEBHOOK_KEY
  );

  if (event.type !== 'checkout.session.completed')
    throw new HttpException('Method is not implemented', 501);

  const customerAddress = event.data.object.customer_details?.address;
  const metadata = event.data.object.metadata as CheckoutMetadata;
  const userId = metadata.customerId;
  const products: { id: string; quantity: number }[] = JSON.parse(metadata.products);

  await placeOrder({
    paid: true,
    paymentType: 'online',
    products,
    userId,
    address: {
      city: customerAddress?.city,
      country: customerAddress?.country,
      state: customerAddress?.state,
      postalCode: customerAddress?.postal_code
    },
    clearCart: metadata.isCart === 'true' ? true : false
  });
  return res.json({ message: 'Order placed successfully' });
});
