import nodemailer from 'nodemailer';
import { env } from '../config/env.config';

export default async function sendEmail({
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
