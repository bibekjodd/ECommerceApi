import nodemailer from "nodemailer";

export default async function sendEmail({
  text,
  mail,
  subject,
}: {
  text: string;
  mail: string;
  subject?: string;
}) {
  const transporter = nodemailer.createTransport({
   service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    html: text,
    to: mail,
    subject,
  });
}
