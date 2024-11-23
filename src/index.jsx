import { render } from 'solid-js/web';
import App from './App';
import './index.css';

import { Router } from '@solidjs/router';

// تهيئة Sentry لتسجيل الأخطاء
import * as Sentry from '@sentry/browser';

import { SettingsProvider } from './contexts/SettingsContext';

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

// إضافة كود Umami لتحليل المستخدمين
if (!window.location.hostname.includes('vercel.app')) {
  const umamiScript = document.createElement('script');
  umamiScript.defer = true;
  umamiScript.src = 'https://cloud.umami.is/script.js';
  umamiScript.setAttribute('data-website-id', import.meta.env.VITE_PUBLIC_UMAMI_WEBSITE_ID);
  document.head.appendChild(umamiScript);
}

render(
  () => (
    <Router>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </Router>
  ),
  document.getElementById('root')
);