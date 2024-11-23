import { blogPosts } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

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

    // Check if user is admin
    if (!user || user.email !== 'daoudi.abdennour@gmail.com') {
      return res.status(403).json({ error: 'غير مصرح' });
    }

    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: 'معرف المقال مطلوب' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    await db.delete(blogPosts).where(eq(blogPosts.id, postId));

    res.status(200).json({ message: 'تم حذف المقال بنجاح' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف المقال' });
  }
}