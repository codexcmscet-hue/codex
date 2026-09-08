import nodemailer from 'nodemailer';
import { config } from './index';
import { logger } from './logger';

export const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: config.smtp.user ? {
    user: config.smtp.user,
    pass: config.smtp.pass,
  } : undefined,
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  try {
    if (config.env === 'development' && !config.smtp.user && config.smtp.host === 'localhost') {
      logger.info(`[EMAIL DEV LOG] To: ${to} | Subject: ${subject}`);
    }

    const info = await transporter.sendMail({
      from: `"CodeX Club" <${config.smtp.from}>`,
      to,
      subject,
      text,
      html,
    });

    logger.debug(`Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error);
    return false;
  }
}
