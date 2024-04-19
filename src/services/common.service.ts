import { Notification } from '@/models/notification.model';
import { Order } from '@/models/order.model';
import { Product } from '@/models/product.model';
import { Review } from '@/models/review.model';

export const cascadeOnDeleteUser = async (userId: string) => {
  await Promise.all([
    Product.deleteMany({ owner: userId }),
    Review.deleteMany({ reviewer: userId }),
    Notification.deleteMany({ user: userId }),
    Order.deleteMany({ user: userId })
  ]);
};

export const cascadeOnDeleteProduct = async (productId: string) => {
  await Promise.all([Review.deleteMany({ product: productId })]);
};
