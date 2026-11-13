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

const STUDENT_COUNT_OPTIONS = ['1', '2', '3', '4', '5+'];
const MIN_STUDENT_AGE = 5;
const MAX_STUDENT_AGE = 19;
const BETA_MIN_AGE = 13;
const INVALID_AGES_MESSAGE = "Please enter each student's age as a number, e.g. 13, 15.";

// Parses "13, 15" / "13 and 15" / "13/15" into a list of whole-number ages.
// Returns null if the text has anything other than numbers and separators, or an age outside 5-19.
export const parseStudentAges = (value: string): number[] | null => {
  const cleaned = value.replace(/\band\b/gi, ',');
  if (!/^[\d\s,;/&]+$/.test(cleaned)) return null;
  const ages = (cleaned.match(/\d+/g) || []).map((n) => parseInt(n, 10));
  if (ages.length === 0 || ages.length > 20) return null;
  if (ages.some((age) => age < MIN_STUDENT_AGE || age > MAX_STUDENT_AGE)) return null;
  return ages;
};

const readCheckbox = (value: unknown): boolean | null => {
  if (value === undefined || value === null || value === false || value === '') return false;
  if (value === true || value === 'on' || value === 'true') return true;
  return null;
};

type InquiryType = 'pilot_program' | 'homeschool_family';

interface Inquiry {
  type: InquiryType;
  // Columns in the Supabase `leads` table (name, email, school, message, type). Do not add columns:
  // the table lives in a separate database whose schema we can't change from here.
  name: string;
  email: string;
  school: string;
  message: string;
  emailSubject: string;
  emailText: string;
  emailHtml: string;
}

const buildPilotInquiry = (body: any): Inquiry | null => {
  const name = readField(body.name, 200, true);
  const email = readField(body.email, 254, true);
  const school = readField(body.school, 200, true);
  const message = readField(body.message, 5000, false);

  if (name === null || email === null || school === null || message === null || !EMAIL_PATTERN.test(email)) {
    return null;
  }

  return {
    type: 'pilot_program',
    name,
    email,
    school,
    message,
    emailSubject: `New Arwright Pilot Inquiry: ${singleLine(school)}`,
    emailText: `New Inquiry from ${name}\nEmail: ${email}\nSchool: ${school}\nMessage: ${message}`,
    emailHtml: `
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
  };
};

type HomeschoolResult = { inquiry: Inquiry } | { error: string };

const buildHomeschoolInquiry = (body: any): HomeschoolResult => {
  const name = readField(body.name, 200, true);
  const email = readField(body.email, 254, true);
  const familyName = readField(body.school, 200, false);
  const studentCount = readField(body.studentCount, 3, true);
  const agesText = readField(body.studentAges, 100, true);
  const foundingInterest = readCheckbox(body.foundingFamily);
  const userMessage = readField(body.message, 5000, false);

  if (
    name === null ||
    email === null ||
    familyName === null ||
    studentCount === null ||
    !STUDENT_COUNT_OPTIONS.includes(studentCount) ||
    agesText === null ||
    foundingInterest === null ||
    userMessage === null ||
    !EMAIL_PATTERN.test(email)
  ) {
    return { error: INVALID_INPUT_MESSAGE };
  }

  const ages = parseStudentAges(agesText);
  if (ages === null) {
    return { error: INVALID_AGES_MESSAGE };
  }

  // Under-13 inquiries are still accepted (the form shows a note that the beta is for 13+);
  // we flag them so the team can follow up.
  const hasUnder13 = ages.some((age) => age < BETA_MIN_AGE);
  const agesLabel = ages.join(', ');
  const studentCountLabel = studentCount === '5+' ? '5 or more' : studentCount;
  const foundingLabel = foundingInterest ? 'Yes' : 'No';
  const school = familyName || 'Homeschool';

  const detailLines = [
    '[Homeschool family inquiry]',
    `Number of students: ${studentCountLabel}`,
    `Student ages: ${agesLabel}`,
    ...(hasUnder13 ? ['Note: at least one student is under 13 (the beta is for students 13+)'] : []),
    `Interested in being a founding family: ${foundingLabel}`,
  ];
  const message = `${detailLines.join('\n')}\n\nMessage:\n${userMessage || '(none)'}`;

  const rows: Array<[string, string]> = [
    ['Inquiry type', 'Homeschool family'],
    ['Parent name', name],
    ['Email', email],
    ['Family name', familyName || '(not given)'],
    ['Number of students', studentCountLabel],
    ['Student ages', agesLabel],
    ...(hasUnder13 ? ([['Under 13', 'Yes: at least one student is under 13 (beta is 13+)']] as Array<[string, string]>) : []),
    ['Interested in being a founding family', foundingLabel],
  ];

  return {
    inquiry: {
      type: 'homeschool_family',
      name,
      email,
      school,
      message,
      emailSubject: `New Arwright Homeschool Family Inquiry: ${singleLine(name)}`,
      emailText: `New Homeschool Family Inquiry from ${name}\n${rows
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n')}\nMessage: ${userMessage || '(none)'}`,
      emailHtml: `
            <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
              <h2 style="color: #1A1A1A;">New Homeschool Family Inquiry from ${escapeHtml(name)}</h2>
              ${rows
                .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
                .join('\n              ')}
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(userMessage || '(none)').replace(/\r?\n/g, '<br>')}</p>
              </div>
            </div>
          `,
    },
  };
};

// API Endpoint for inquiries: school pilots (default, unchanged) and homeschool families
app.post('/api/inquiry', async (req, res) => {
  const body = (req.body && typeof req.body === 'object') ? req.body : {};
  const requestedType = body.type === undefined || body.type === null ? 'pilot_program' : body.type;

  let inquiry: Inquiry | null = null;
  if (requestedType === 'pilot_program') {
    inquiry = buildPilotInquiry(body);
    if (!inquiry) {
      return res.status(400).json({ success: false, error: INVALID_INPUT_MESSAGE });
    }
  } else if (requestedType === 'homeschool_family') {
    const result = buildHomeschoolInquiry(body);
    if ('error' in result) {
      return res.status(400).json({ success: false, error: result.error });
    }
    inquiry = result.inquiry;
  } else {
    return res.status(400).json({ success: false, error: INVALID_INPUT_MESSAGE });
  }

  console.log('[API] Received inquiry', { type: inquiry.type });

  const results = {
    supabase: 'skipped',
    email: 'skipped',
  };

  try {
    // 1. Store in Supabase. A failure here (including a thrown error) must not stop the email below.
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('leads')
          .insert([
            {
              name: inquiry.name,
              email: inquiry.email,
              school: inquiry.school,
              message: inquiry.message,
              type: inquiry.type,
            },
          ]);

        if (error) {
          console.error('[API] Supabase insert failed', { code: error.code, type: inquiry.type });
          results.supabase = 'error';
        } else {
          results.supabase = 'success';
        }
      } else {
        results.supabase = 'not_configured';
      }
    } catch (dbError: any) {
      console.error('[API] Supabase insert threw', { name: dbError?.name, type: inquiry.type });
      results.supabase = 'error';
    }

    // 2. Send via SMTP
    const transporter = getTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Arwright Platform" <${process.env.SMTP_USER}>`,
          to: 'hello@arwrightlearning.com', 
          subject: inquiry.emailSubject,
          text: inquiry.emailText,
          html: inquiry.emailHtml,
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
