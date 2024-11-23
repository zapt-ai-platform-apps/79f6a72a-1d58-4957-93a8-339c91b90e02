import { initializeZapt } from '@zapt/zapt-js';
import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

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
    const { supabase } = initializeZapt(process.env.APP_ID, {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    });

    const adminUser = await authenticateUser(req);

    if (!adminUser || adminUser.email !== 'daoudi.abdennour@gmail.com') {
      return res.status(403).json({ error: 'غير مصرح' });
    }

    const { userId, isActive } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'مطلوب تحديد المستخدم' });
    }

    const updates = isActive
      ? { banned_until: new Date().toISOString() }
      : { banned_until: null };

    const { data, error } = await supabase.auth.admin.updateUserById(userId, updates);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'تم تحديث حالة المستخدم بنجاح' });
  } catch (error) {
    console.error('Error toggling user status:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error toggling user status' });
  }
}