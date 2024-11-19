import * as Sentry from "@sentry/node";
import { authenticateUser, isAdmin } from "./_apiUtils.js";
import { messages } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID,
    },
  },
});

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    if (!isAdmin(user)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing message ID' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    await db.delete(messages).where(eq(messages.id, id));

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error deleting message' });
  }
}