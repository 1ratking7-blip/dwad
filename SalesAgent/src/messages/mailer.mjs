import nodemailer from 'nodemailer';
import { SENDER_CONFIG } from './config.mjs';

// SENDER_CONFIG became locale-keyed (ru/vi) on 2026-07-28 for bilingual outreach — real sender
// identity/contact address is identical across locales (only service_name/case_study_blurb
// differ), so using the ru entry here for the SMTP "from name"/reply-to isn't a locale bug, just
// avoiding threading locale through sendMail() for two fields that never actually diverge.
const DEFAULT_SENDER = SENDER_CONFIG.ru;

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
 *
 * @param {object} opts
 * @param {string} [opts.inReplyTo] - the original Message-ID (with angle brackets) to thread
 *   this as a genuine reply — needed so a reply to a real lead's response lands in the same
 *   thread/support ticket instead of arriving as an unrelated new message. Get it from an
 *   envelope's `messageId` field (see bin/check-replies.mjs).
 * @param {string[]} [opts.references] - same idea, full reference chain if known.
 */
export async function sendMail({ to, subject, body, inReplyTo, references }) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || `${DEFAULT_SENDER.sender_name} <${requiredEnv('SMTP_USER')}>`;
  return transporter.sendMail({
    from,
    to,
    subject: subject || '(no subject)',
    text: body,
    inReplyTo,
    references,
    replyTo: DEFAULT_SENDER.calendly_or_contact.includes('@')
      ? DEFAULT_SENDER.calendly_or_contact
      : undefined,
  });
}

export async function verifySmtpConfig() {
  const transporter = getTransporter();
  await transporter.verify();
}
