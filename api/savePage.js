import { pages } from '../drizzle/schema.js';
import { authenticateUser, isAdmin } from "./_apiUtils.js";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as Sentry from "@sentry/node";

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
  const allowedMethods = ['POST', 'PUT', 'DELETE'];

  if (!allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    if (!isAdmin(user)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    if (req.method === 'POST') {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await db.insert(pages).values({
        title,
        content,
      }).returning();

      res.status(201).json(result[0]);
    } else if (req.method === 'PUT') {
      const { id, title, content } = req.body;
      if (!id || !title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await db.update(pages).set({
        title,
        content,
      }).where(eq(pages.id, id));

      res.status(200).json({ success: true });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Missing page ID' });
      }

      await db.delete(pages).where(eq(pages.id, id));

      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Error managing page:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error managing page' });
  }
}