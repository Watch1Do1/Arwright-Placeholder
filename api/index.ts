import express from 'express';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

const app = express();
app.use(express.json({ limit: '20kb' }));

// Initialize Nodemailer Transporter lazily
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT || '587';
  
  if (!host || !user || !pass) {
    console.error('SMTP variables missing:', { host: !!host, user: !!user, pass: !!pass });
    return null;
  }
  
  return nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure: parseInt(port) === 465,
    auth: {
      user,
      pass,
    },
  });
};

const getSupabase = () => {
  let url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('Supabase variables missing:', { url: !!url, key: !!key });
    return null;
  }

  // Sanitize URL
  url = url.replace(/\/$/, '').replace(/\/rest\/v1$/, '');
  
  return createClient(url, key, {
    auth: { persistSession: false },
    realtime: { transport: ws as any },
  });
};

// Escape user-provided text before placing it in the notification email's HTML
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Remove line breaks and control characters (used for the email subject line)
const singleLine = (value: string) => value.replace(/[\u0000-\u001F\u007F]+/g, ' ').trim();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INVALID_INPUT_MESSAGE = 'Please check the form fields and try again.';
const SEND_FAILED_MESSAGE =
  "We couldn't send your inquiry. Please email hello@arwrightlearning.com.";

// Returns the trimmed string, or null if it is not a string or is too long / empty when required
const readField = (value: unknown, maxLength: number, required: boolean): string | null => {
  if (value === undefined || value === null) return required ? null : '';
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length > maxLength) return null;
  if (required && trimmed.length === 0) return null;
  return trimmed;
};

// API Endpoint for Pilot Inquiries
app.post('/api/inquiry', async (req, res) => {
  const body = (req.body && typeof req.body === 'object') ? req.body : {};
  const name = readField(body.name, 200, true);
  const email = readField(body.email, 254, true);
  const school = readField(body.school, 200, true);
  const message = readField(body.message, 5000, false);

  if (name === null || email === null || school === null || message === null || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ success: false, error: INVALID_INPUT_MESSAGE });
  }

  console.log('[API] Received inquiry');

  const results = {
    supabase: 'skipped',
    email: 'skipped',
  };

  try {
    // 1. Store in Supabase
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('leads')
        .insert([{ name, email, school, message, type: 'pilot_program' }]);
      
      if (error) {
        console.error('[API] Supabase insert failed', { code: error.code });
        results.supabase = 'error';
      } else {
        results.supabase = 'success';
      }
    } else {
      results.supabase = 'not_configured';
    }

    // 2. Send via SMTP
    const transporter = getTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Arwright Platform" <${process.env.SMTP_USER}>`,
          to: 'hello@arwrightlearning.com', 
          subject: `New Arwright Pilot Inquiry: ${singleLine(school)}`,
          text: `New Inquiry from ${name}\nEmail: ${email}\nSchool: ${school}\nMessage: ${message}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
              <h2 style="color: #1A1A1A;">New Inquiry from ${escapeHtml(name)}</h2>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>School:</strong> ${escapeHtml(school)}</p>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message).replace(/\r?\n/g, '<br>')}</p>
              </div>
            </div>
          `,
        });
        results.email = 'success';
      } catch (mailError: any) {
        console.error('[API] Email send failed', {
          code: mailError?.code,
          responseCode: mailError?.responseCode,
        });
        results.email = 'error';
      }
    } else {
      results.email = 'not_configured';
    }

    // Only report success if the inquiry was actually saved or emailed
    if (results.supabase === 'success' || results.email === 'success') {
      return res.status(200).json({ success: true });
    }

    console.error('[API] Inquiry was neither saved nor emailed', {
      supabase: results.supabase,
      email: results.email,
    });
    return res.status(502).json({ success: false, error: SEND_FAILED_MESSAGE });
  } catch (error: any) {
    console.error('[API] Unexpected error', { name: error?.name });
    return res.status(500).json({ success: false, error: SEND_FAILED_MESSAGE });
  }
});

export default app;
