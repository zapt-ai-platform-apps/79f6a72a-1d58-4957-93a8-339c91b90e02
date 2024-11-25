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
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { fullName, username, phoneNumber, gender, country } = req.body;

    if (!fullName || !username || !phoneNumber || !gender || !country) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const existingProfile = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    if (existingProfile.length === 0) {
      // Create new profile
      await db.insert(profiles).values({
        userId: user.id,
        fullName,
        username,
        phoneNumber,
        gender,
        country,
      });
    } else {
      // Update existing profile
      await db.update(profiles)
        .set({
          fullName,
          username,
          phoneNumber,
          gender,
          country,
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, user.id));
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error updating user profile' });
  }
}