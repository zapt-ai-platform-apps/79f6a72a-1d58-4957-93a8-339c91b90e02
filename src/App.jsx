import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense } from 'solid-js';
import BottomNavBar from './components/BottomNavBar';
import Loader from './components/Loader';

const MainPage = lazy(() => import('./pages/MainPage'));
const Blog = lazy(() => import('./pages/Blog'));
const Store = lazy(() => import('./pages/Store'));
const Forum = lazy(() => import('./pages/Forum'));
const Services = lazy(() => import('./pages/Services'));
const Tools = lazy(() => import('./pages/Tools'));
const Assistant = lazy(() => import('./pages/Assistant'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const TextEditor = lazy(() => import('./pages/TextEditor'));
const JoinUs = lazy(() => import('./pages/JoinUs'));

function App() {
  return (
    <div class="h-full flex flex-col bg-background text-gray-800" dir="rtl">
      <Suspense fallback={<div class="flex-grow flex items-center justify-center"><Loader loading={true} /></div>}>
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
          <Route path="/content-generator" component={ContentGenerator} />
          <Route path="/text-editor" component={TextEditor} />
          <Route path="/join-us" component={JoinUs} />
        </Routes>
      </Suspense>
      <BottomNavBar />
    </div>
  );
}

export default App;