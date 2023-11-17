import { env } from '@/config/env.config';
import nodemailer from 'nodemailer';

export default async function sendMail({
  text,
  mail,
  subject
}: {
  text: string;
  mail: string;
  subject?: string;
}) {
  const transporter = nodemailer.createTransport({
    service: env.SMTP_SERVICE,
    auth: {
      user: env.SMTP_MAIL,
      pass: env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    html: text,
    to: mail,
    subject
  });
}
