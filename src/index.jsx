import { render } from 'solid-js/web';
import App from './App';
import './index.css';

// إضافة دعم PWA للتطبيق (سيضيف هذا خدمة العامل وملف مانيفيست، لا تحتاج لفعل أي شيء آخر)
window.progressierAppRuntimeSettings = {
  uid: import.meta.env.VITE_PUBLIC_APP_ID,
  icon512: "https://your.icon/url/here.png",
  name: "أدوات Blind Accessibility",
  shortName: "أدوات الوصول"
};
let script = document.createElement('script');
script.setAttribute('src', 'https://progressier.app/z8yY3IKmfpDIw3mSncPh/script.js');
script.setAttribute('defer', 'true');
document.querySelector('head').appendChild(script);

// تهيئة Sentry لتسجيل الأخطاء
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
  environment: import.meta.env.VITE_PUBLIC_APP_ENV,
  integrations: [Sentry.browserTracingIntegration()],
  initialScope: {
    tags: {
      type: 'frontend',
      projectId: import.meta.env.VITE_PUBLIC_APP_ID
    }
  }
});

render(() => <App />, document.getElementById('root'));