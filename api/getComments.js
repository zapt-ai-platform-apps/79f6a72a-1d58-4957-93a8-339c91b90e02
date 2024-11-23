import { comments } from '../drizzle/schema.js';
import * as Sentry from '@sentry/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';

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
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const postComments = await db.select()
      .from(comments)
      .where(eq(comments.postId, parseInt(postId)))
      .orderBy(desc(comments.createdAt));

    res.status(200).json(postComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
}