import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Nodemailer Transporter lazily
const getTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const getSupabase = () => {
  let url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) return null;

  // Sanitize URL: Remove trailing slash and /rest/v1 if present
  url = url.replace(/\/$/, '').replace(/\/rest\/v1$/, '');
  
  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
    realtime: {
      transport: ws as any,
    },
  });
};

// API Endpoint for Pilot Inquiries
app.post('/api/inquiry', async (req, res) => {
  const { name, email, school, message } = req.body;
  console.log(`Received inquiry from: ${email}`);

  try {
    // 1. Store in Supabase if configured
    const supabase = getSupabase();
    if (supabase) {
      console.log('Attempting to store lead in Supabase...');
      const { error } = await supabase
        .from('leads')
        .insert([{ name, email, school, message, type: 'pilot_program' }]);
      
      if (error) {
        console.error('Supabase Insert Error:', error.message);
        console.error('Details:', error.details, error.hint);
      } else {
        console.log('Successfully stored lead in Supabase table "leads"');
      }
    } else {
      console.warn('Supabase not configured (Missing SUPABASE_URL or SUPABASE_ANON_KEY). Skipping DB storage.');
    }

    // 2. Send via SMTP if configured
    const transporter = getTransporter();
    if (transporter) {
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
    } else {
      console.warn('SMTP not configured, skipping email notification.');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Inquiry endpoint error:', error);
    res.status(500).json({ error: 'Failed to process inquiry' });
  }
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not running as a Vercel serverless function
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
