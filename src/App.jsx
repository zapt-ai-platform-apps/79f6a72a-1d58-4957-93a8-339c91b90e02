import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense } from 'solid-js';
import BottomNavBar from './components/BottomNavBar';
import Loader from './components/Loader';

const MainPage = lazy(() => import('./pages/MainPage'));
const Store = lazy(() => import('./pages/Store'));
// Removed import of Forum page
const Services = lazy(() => import('./pages/Services'));
const Tools = lazy(() => import('./pages/Tools'));
const Assistant = lazy(() => import('./pages/Assistant'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const ResumeResult = lazy(() => import('./pages/ResumeResult'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const ContentResult = lazy(() => import('./pages/ContentResult'));
const TextEditor = lazy(() => import('./pages/TextEditor'));
const TextResult = lazy(() => import('./pages/TextResult'));
const JoinUs = lazy(() => import('./pages/JoinUs'));

function App() {
  return (
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-blue-100 to-white text-gray-800" dir="rtl">
      <Suspense fallback={<div class="flex-grow flex items-center justify-center"><Loader loading={true} /></div>}>
        <Routes>
          <Route path="/" component={MainPage} />
          <Route path="/store" component={Store} />
          {/* Removed route to Forum */}
          <Route path="/services" component={Services} />
          <Route path="/tools" component={Tools} />
          <Route path="/assistant" component={Assistant} />
          <Route path="/voice-assistant" component={VoiceAssistant} />
          <Route path="/resume-builder" component={ResumeBuilder} />
          <Route path="/resume-result" component={ResumeResult} />
          <Route path="/content-generator" component={ContentGenerator} />
          <Route path="/content-result" component={ContentResult} />
          <Route path="/text-editor" component={TextEditor} />
          <Route path="/text-result" component={TextResult} />
          <Route path="/join-us" component={JoinUs} />
        </Routes>
      </Suspense>
      <BottomNavBar />
    </div>
  );
}

export default App;