import { shopItems } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { desc } from 'drizzle-orm';
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db.select().from(shopItems).orderBy(desc(shopItems.createdAt));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching shop items:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error fetching shop items' });
  }
}