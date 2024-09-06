import { getOrderStatsSchema, getSalesStatsSchema } from '@/dtos/stats.dto';
import { UnauthorizedException } from '@/lib/exceptions';
import { calculateQueryDate } from '@/lib/utils';
import { handleAsync } from '@/middlewares/handle-async';
import { Order } from '@/models/order.model';
import { selectProductProperties } from '@/models/product.model';
import { Sales } from '@/models/sales.model';
import { selectUserProperties } from '@/models/user.model';

export const getOrderStats = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();

  const { days } = getOrderStatsSchema.parse(req.query);
  const date = calculateQueryDate(days);
  const stats = await Order.find({ seller: req.user._id.toString(), createdAt: { $gte: date } })
    .populate({ path: 'seller', select: selectUserProperties })
    .populate({ path: 'user', select: selectUserProperties })
    .populate({ path: 'product', select: selectProductProperties });

  return res.json({ totalResults: stats.length, stats });
});

export const getSalesStats = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();

  const { days } = getSalesStatsSchema.parse(req.query);
  const date = calculateQueryDate(days);
  const stats = await Sales.find({ seller: req.user._id.toString(), createdAt: { $gte: date } })
    .populate({ path: 'seller', select: selectUserProperties })
    .populate({ path: 'user', select: selectUserProperties })
    .populate({ path: 'product', select: selectProductProperties });

  return res.json({ totalResults: stats.length, stats });
});
