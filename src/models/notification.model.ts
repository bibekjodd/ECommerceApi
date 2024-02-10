import mongoose from 'mongoose';

type TNotification = {
  title: string;
  description?: string;
  user: mongoose.Types.ObjectId;
};
const notificationSchema = new mongoose.Schema<TNotification>(
  {
    title: {
      type: String,
      required: [true, 'Notification must have title'],
      trim: true,
      transform(notification: string) {
        return notification.slice(0, 100);
      }
    },
    description: {
      type: String,
      transform(description: string) {
        return description.slice(0, 200);
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
