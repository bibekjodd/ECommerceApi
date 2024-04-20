import mongoose from 'mongoose';

type NotificationSchema = {
  title: string;
  description?: string;
  user: mongoose.Types.ObjectId;
  createdAt: NativeDate;
};
const notificationSchema = new mongoose.Schema<NotificationSchema>(
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
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
