import { blogPosts } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
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
    const { category, id } = req.query;

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    let query = db.select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));

    if (category) {
      query = query.where(eq(blogPosts.category, category));
    }

    if (id) {
      query = query.where(eq(blogPosts.id, parseInt(id)));
    }

    const posts = await query;

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error fetching blog posts' });
  }
}