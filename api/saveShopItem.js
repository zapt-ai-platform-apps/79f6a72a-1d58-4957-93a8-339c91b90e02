import { shopItems } from '../drizzle/schema.js';
import { authenticateUser, isAdmin } from "./_apiUtils.js";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
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
      const { name, description, price, imageUrl } = req.body;
      if (!name || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await db.insert(shopItems).values({
        name,
        description,
        price,
        imageUrl,
      }).returning();

      res.status(201).json(result[0]);
    } else if (req.method === 'PUT') {
      const { id, name, description, price, imageUrl } = req.body;
      if (!id || !name || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await db.update(shopItems).set({
        name,
        description,
        price,
        imageUrl,
      }).where(eq(shopItems.id, id));

      res.status(200).json({ success: true });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Missing shop item ID' });
      }

      await db.delete(shopItems).where(eq(shopItems.id, id));

      res.status(200).json({ success: true });
    }

  } catch (error) {
    console.error('Error managing shop item:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error managing shop item' });
  }
}