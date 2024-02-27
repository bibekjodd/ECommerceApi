import { handleAsync } from '@/middlewares/handle-async';
import { Notification } from '@/models/notification.model';

type GetNotificationQuery = {
  page?: string;
};
export const getNotifications = handleAsync<
  unknown,
  unknown,
  unknown,
  GetNotificationQuery
>(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const page_size = 10;
  const skip = (page - 1) * page_size;
  const notifications = await Notification.find({ user: req.userId })
    .limit(page_size)
    .skip(skip);
  return res.json({ notifications });
});
