import * as Sentry from "@sentry/node";
import { authenticateUser, isAdmin } from "./_apiUtils.js";
import { createClient } from '@supabase/supabase-js';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    if (!isAdmin(user)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
}