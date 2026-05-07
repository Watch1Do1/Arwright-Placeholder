import express from 'express';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

const app = express();
app.use(express.json());

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

// API Endpoint for Pilot Inquiries
app.post('/api/inquiry', async (req, res) => {
  const { name, email, school, message } = req.body;
  console.log(`[API] Received inquiry from: ${email}`);

  const results = {
    supabase: 'skipped',
    email: 'skipped',
    errors: [] as string[]
  };

  try {
    // 1. Store in Supabase
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('leads')
        .insert([{ name, email, school, message, type: 'pilot_program' }]);
      
      if (error) {
        console.error('Supabase Error:', error);
        results.supabase = 'error';
        results.errors.push(`Supabase: ${error.message}`);
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
          subject: `New Arwright Pilot Inquiry: ${school}`,
          text: `New Inquiry from ${name}\nEmail: ${email}\nSchool: ${school}\nMessage: ${message}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
              <h2 style="color: #1A1A1A;">New Inquiry from ${name}</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>School:</strong> ${school}</p>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p><strong>Message:</strong></p>
                <p>${message}</p>
              </div>
            </div>
          `,
        });
        results.email = 'success';
      } catch (mailError: any) {
        console.error('Mail Error:', mailError);
        results.email = 'error';
        results.errors.push(`Email: ${mailError.message}`);
      }
    } else {
      results.email = 'not_configured';
    }

    res.status(200).json({ success: results.errors.length === 0, results });
  } catch (error: any) {
    console.error('Global Error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Debug endpoint to check env vars (safe check - only shows existence)
app.get('/api/check', (req, res) => {
  res.json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      HAS_SUPABASE_URL: !!process.env.SUPABASE_URL,
      HAS_SUPABASE_KEY: !!process.env.SUPABASE_ANON_KEY,
      HAS_SMTP_HOST: !!process.env.SMTP_HOST,
      HAS_SMTP_USER: !!process.env.SMTP_USER,
      HAS_SMTP_PASS: !!process.env.SMTP_PASS,
    }
  });
});

export default app;
