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
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  await transporter.sendMail({
    html: text,
    to: mail,
    subject,
  });
}
