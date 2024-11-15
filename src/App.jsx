import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense } from 'solid-js';
import BottomNavBar from './components/BottomNavBar';

const MainPage = lazy(() => import('./pages/MainPage'));
const Blog = lazy(() => import('./pages/Blog'));
const Store = lazy(() => import('./pages/Store'));
const Forum = lazy(() => import('./pages/Forum'));
const Services = lazy(() => import('./pages/Services'));
const Tools = lazy(() => import('./pages/Tools'));
const Assistant = lazy(() => import('./pages/Assistant'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));

function App() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800" dir="rtl">
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <Routes>
          <Route path="/" component={MainPage} />
          <Route path="/blog" component={Blog} />
          <Route path="/store" component={Store} />
          <Route path="/forum" component={Forum} />
          <Route path="/services" component={Services} />
          <Route path="/tools" component={Tools} />
          <Route path="/assistant" component={Assistant} />
          <Route path="/voice-assistant" component={VoiceAssistant} />
          <Route path="/resume-builder" component={ResumeBuilder} />
        </Routes>
      </Suspense>
      <BottomNavBar />
    </div>
  );
}

export default App;