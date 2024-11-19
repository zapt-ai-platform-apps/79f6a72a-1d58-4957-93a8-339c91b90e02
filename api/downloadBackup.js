import { authenticateUser } from './_apiUtils.js';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
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
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);

    if (user.email !== 'daoudi.abdennour@gmail.com') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=backup.zip');

    // Create an archive and pipe to the response
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('error', function (err) {
      throw err;
    });

    archive.pipe(res);

    // Include the files you want to backup
    const directoriesToInclude = [
      'src',
      'public',
      'drizzle',
      'api',
      'package.json',
      'vite.config.js',
      'tailwind.config.js',
      'postcss.config.js',
    ];

    directoriesToInclude.forEach((item) => {
      const itemPath = path.join(process.cwd(), item);

      if (fs.existsSync(itemPath)) {
        if (fs.lstatSync(itemPath).isDirectory()) {
          archive.directory(itemPath, item);
        } else {
          archive.file(itemPath, { name: item });
        }
      }
    });

    await archive.finalize();
  } catch (error) {
    console.error('Error generating backup:', error);
    Sentry.captureException(error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}