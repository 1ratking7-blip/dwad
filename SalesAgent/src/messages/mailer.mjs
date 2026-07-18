import nodemailer from 'nodemailer';
import { SENDER_CONFIG } from './config.mjs';

let cachedTransporter = null;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name} in SalesAgent/.env — see .env.example. SMTP sending is not configured.`
    );
  }
  return value;
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    host: requiredEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: requiredEnv('SMTP_USER'),
      pass: requiredEnv('SMTP_PASS'),
    },
  });
  return cachedTransporter;
}

/**
 * Sends one drafted message over SMTP. Throws on failure — callers decide what
 * "failed" means for their batch (skip and continue, log, etc). Never marks
 * anything as sent itself; that stays the caller's job via crm.markDraftSent().
 */
export async function sendMail({ to, subject, body }) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || `${SENDER_CONFIG.sender_name} <${requiredEnv('SMTP_USER')}>`;
  return transporter.sendMail({
    from,
    to,
    subject: subject || '(no subject)',
    text: body,
    replyTo: SENDER_CONFIG.calendly_or_contact.includes('@')
      ? SENDER_CONFIG.calendly_or_contact
      : undefined,
  });
}

export async function verifySmtpConfig() {
  const transporter = getTransporter();
  await transporter.verify();
}
