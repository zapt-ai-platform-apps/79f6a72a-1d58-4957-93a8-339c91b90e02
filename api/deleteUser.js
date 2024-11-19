import * as Sentry from "@sentry/node";
import { authenticateUser, isAdmin } from "./_apiUtils.js";
import { createClient } from '@supabase/supabase-js';

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
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    if (!isAdmin(user)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
}