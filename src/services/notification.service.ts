import { Notification } from '@/models/notification.model';

type NotifyOptions = {
  title: string;
  description?: string;
  user: string;
};

export const addNotification = async (data: NotifyOptions) => {
  return Notification.create(data);
};
