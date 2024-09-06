import { calculateQueryDate } from '@/lib/utils';
import { Order, TOrder } from '@/models/order.model';
import { selectProductProperties } from '@/models/product.model';
import { Sales, TSale } from '@/models/sales.model';
import { selectUserProperties } from '@/models/user.model';

export const orderStats = async ({
  days,
  sellerId
}: {
  days: number;
  sellerId: string;
}): Promise<TOrder[]> => {
  days--;
  const targetDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  targetDate.setHours(0);
  targetDate.setMinutes(0);
  targetDate.setSeconds(0);
  targetDate.setMilliseconds(0);

  const stats = await Order.find({
    seller: sellerId,
    orderedAt: { $lte: targetDate.toISOString() }
  })
    .populate({ path: 'seller', select: selectUserProperties })
    .populate({ path: 'user', select: selectUserProperties })
    .populate({ path: 'product', select: selectProductProperties });
  return stats;
};

export const salesStats = async ({
  days,
  sellerId
}: {
  days: number;
  sellerId: string;
}): Promise<TSale[]> => {
  const date = calculateQueryDate(days);
  const stats = await Sales.find({
    seller: sellerId,
    createdAt: { $lte: date }
  });
  return stats;
};
