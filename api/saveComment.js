import { comments } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
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
    const user = await authenticateUser(req);

    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db.insert(comments).values({
      postId: parseInt(postId),
      userId: user.id,
      content,
    }).returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error saving comment:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error saving comment' });
  }
}