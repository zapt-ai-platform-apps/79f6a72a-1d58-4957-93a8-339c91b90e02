import { blogPosts } from '../drizzle/schema.js';
import * as Sentry from '@sentry/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, ilike, desc, and } from 'drizzle-orm';

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
    const { category, id, page, limit, search } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    let whereConditions = [];

    if (category) {
      whereConditions.push(eq(blogPosts.category, category));
    }

    if (id) {
      whereConditions.push(eq(blogPosts.id, parseInt(id)));
    }

    if (search) {
      whereConditions.push(
        ilike(blogPosts.title, `%${search}%`)
      );
    }

    const conditions = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const [posts, totalResult] = await Promise.all([
      db.select()
        .from(blogPosts)
        .where(conditions)
        .orderBy(desc(blogPosts.createdAt))
        .limit(pageSize)
        .offset((pageNum - 1) * pageSize),
      db.select({ count: 'count(*)' })
        .from(blogPosts)
        .where(conditions)
    ]);

    const total = parseInt(totalResult[0].count);

    res.status(200).json({ posts, total });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error fetching blog posts' });
  }
}