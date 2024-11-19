import { messages } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { type, name, email, phone, message } = req.body;

    if (!type || !name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db.insert(messages).values({
      type,
      name,
      email,
      phone,
      message
    }).returning();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving message:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error saving message' });
  }
}