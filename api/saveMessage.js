import { messages } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import * as Sentry from '@sentry/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID,
    },
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { type, name, email, phone, message } = req.body;

    if (!type || !name || !email || !message) {
      return res.status(400).json({ error: 'Type, name, email, and message are required' });
    }

    let userId = null;
    try {
      const user = await authenticateUser(req);
      userId = user.id;
    } catch (err) {
      // User not authenticated
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    await db.insert(messages).values({
      type,
      name,
      email,
      phone,
      message,
      userId, // Will be null if user not authenticated
    });

    res.status(201).json({ message: 'Message saved successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error saving message' });
  }
}