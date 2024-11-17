import { render } from 'solid-js/web';
import App from './App';
import './index.css';

import { Router } from '@solidjs/router';

// تهيئة Sentry لتسجيل الأخطاء
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
  environment: import.meta.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'frontend',
      projectId: import.meta.env.VITE_PUBLIC_APP_ID,
    },
  },
});

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root')
);