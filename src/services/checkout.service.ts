import { BadRequestException, NotFoundException } from '@/lib/exceptions';
import { stripe } from '@/lib/stripe';
import { Product, TProduct } from '@/models/product.model';
import Stripe from 'stripe';

type Product = { id: string; quantity: number };
export type CheckoutMetadata = { customerId: string; products: string; isCart?: 'true' | 'false' };
export const createCheckoutSession = async ({
  products,
  customerId,
  customerEmail,
  successUrl,
  cancelUrl,
  isCart
}: {
  products: Product[];
  customerId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  isCart: 'true' | 'false';
}): Promise<{ checkoutSession: Stripe.Checkout.Session; checkoutProducts: TProduct[] }> => {
  const checkoutProducts = await validateCheckoutProduct(products);
  const metadata: CheckoutMetadata = {
    customerId,
    products: JSON.stringify(products),
    isCart
  };

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = checkoutProducts.map(
    (product) => {
      const finalPrice = Math.ceil(product.price - (product.price * product.discountRate) / 100);
      const quantity = products.find(({ id }) => id === product._id.toString())!.quantity;
      return {
        quantity,
        price_data: {
          currency: 'usd',
          unit_amount: finalPrice * 100,
          product_data: {
            name: product.title,
            description: product.description.at(0) || '',
            images: [product.image]
          }
        }
      };
    }
  );

  const checkoutSession = await stripe.checkout.sessions.create({
    metadata,
    customer_email: customerEmail,
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    mode: 'payment'
  });
  return {
    checkoutProducts,
    checkoutSession
  };
};

export const validateCheckoutProduct = async (products: Product[]): Promise<TProduct[]> => {
  const productIds = products.map((product) => product.id);
  const result = await Product.find({ _id: { $in: productIds } });

  const totalNotFoundProducts = productIds.length - result.length;
  if (totalNotFoundProducts !== 0) {
    throw new NotFoundException(
      `${totalNotFoundProducts} products does not exist among the requested products`
    );
  }

  products.forEach((product) => {
    const currentProduct = result.find(
      (resultProduct) => resultProduct._id.toString() === product.id
    );

    if (!currentProduct)
      throw new NotFoundException('Some of the products listed on cart are unavailable');

    if (currentProduct.stock === 0)
      throw new BadRequestException(`${currentProduct.title} is sold out`);

    if (product.quantity > currentProduct.stock)
      throw new BadRequestException(
        `Requested ${product.quantity} units for ${currentProduct.title} but only ${currentProduct.stock} units are available`
      );
  });

  return result;
};
