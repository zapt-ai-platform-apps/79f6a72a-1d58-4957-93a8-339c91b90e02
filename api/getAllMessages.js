import { messages } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import * as Sentry from '@sentry/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { desc } from 'drizzle-orm';

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
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    if (user.email !== 'daoudi.abdennour@gmail.com') {
      // ليس مخولاً
      return res.status(403).json({ error: 'غير مصرح' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const allMessages = await db.select()
      .from(messages)
      .orderBy(desc(messages.createdAt));

    res.status(200).json(allMessages);
  } catch (error) {
    console.error('Error fetching all messages:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
}