import { profiles } from '../drizzle/schema.js';
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
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const profileData = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    if (profileData.length === 0) {
      return res.status(200).json({ profile: null });
    }

    res.status(200).json({ profile: profileData[0] });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
}