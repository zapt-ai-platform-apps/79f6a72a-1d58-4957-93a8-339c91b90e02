import { blogPosts } from '../drizzle/schema.js';
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

    // Check if user is admin
    if (!user || user.email !== 'daoudi.abdennour@gmail.com') {
      return res.status(403).json({ error: 'غير مصرح' });
    }

    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'العنوان والمحتوى والتصنيف مطلوبة' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    await db.insert(blogPosts).values({
      title,
      content,
      category,
      authorId: user.id,
    });

    res.status(201).json({ message: 'تم حفظ المقال بنجاح' });
  } catch (error) {
    console.error('Error saving blog post:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'حدث خطأ أثناء حفظ المقال' });
  }
}