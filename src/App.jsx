import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense } from 'solid-js';
import BottomNavBar from './components/BottomNavBar';
import TopNavBar from './components/TopNavBar';
import Loader from './components/Loader';
import NotificationProvider from './components/NotificationProvider';

const MainPage = lazy(() => import('./pages/MainPage'));
const Assistant = lazy(() => import('./pages/Assistant'));
const OrderYourApp = lazy(() => import('./pages/OrderYourApp'));
const OrderYourAppForm = lazy(() => import('./pages/OrderYourAppForm'));
const OrderYourWebsite = lazy(() => import('./pages/OrderYourWebsite'));
const Services = lazy(() => import('./pages/Services'));
const Tools = lazy(() => import('./pages/Tools'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const ContentResult = lazy(() => import('./pages/ContentResult'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const ResumeResult = lazy(() => import('./pages/ResumeResult'));
const Radio = lazy(() => import('./pages/Radio'));
const TextEditor = lazy(() => import('./pages/TextEditor'));
const TextResult = lazy(() => import('./pages/TextResult'));
const ImageGenerator = lazy(() => import('./pages/ImageGenerator'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const JoinTheTeam = lazy(() => import('./pages/JoinTheTeam'));
const Blog = lazy(() => import('./pages/Blog'));
const Store = lazy(() => import('./pages/Store'));

function App() {
  return (
    <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800" dir="rtl">
      <NotificationProvider>
        <TopNavBar />
        <div class="flex-grow pb-16 h-full">
          <Suspense fallback={<div class="flex items-center justify-center h-full"><Loader loading={true} /></div>}>
            <Routes>
              <Route path="/" component={MainPage} />
              <Route path="/assistant" component={Assistant} />
              <Route path="/order-your-app" component={OrderYourApp} />
              <Route path="/order-your-app-form" component={OrderYourAppForm} />
              <Route path="/order-your-website" component={OrderYourWebsite} />
              <Route path="/services" component={Services} />
              <Route path="/tools" component={Tools} />
              <Route path="/voice-assistant" component={VoiceAssistant} />
              <Route path="/content-generator" component={ContentGenerator} />
              <Route path="/content-result" component={ContentResult} />
              <Route path="/resume-builder" component={ResumeBuilder} />
              <Route path="/resume-result" component={ResumeResult} />
              <Route path="/radio" component={Radio} />
              <Route path="/text-editor" component={TextEditor} />
              <Route path="/text-result" component={TextResult} />
              <Route path="/image-generator" component={ImageGenerator} />
              <Route path="/contact-us" component={ContactUs} />
              <Route path="/join-the-team" component={JoinTheTeam} />
              <Route path="/blog" component={Blog} />
              <Route path="/store" component={Store} />
            </Routes>
          </Suspense>
        </div>
        <BottomNavBar />
      </NotificationProvider>
    </div>
  );
}

export default App;