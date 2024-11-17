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
const AssistantResult = lazy(() => import('./pages/AssistantResult'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'));
const VoiceAssistantResult = lazy(() => import('./pages/VoiceAssistantResult'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const ResumeResult = lazy(() => import('./pages/ResumeResult'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const ContentResult = lazy(() => import('./pages/ContentResult'));
const TextEditor = lazy(() => import('./pages/TextEditor'));
const TextResult = lazy(() => import('./pages/TextResult'));
const JoinUs = lazy(() => import('./pages/JoinUs'));

function App() {
  return (
    <div class="min-h-screen flex flex-col bg-background text-gray-800" dir="rtl">
      <Suspense fallback={<div class="flex-grow flex items-center justify-center"><Loader loading={true} /></div>}>
        <Routes>
          <Route path="/" component={MainPage} />
          <Route path="/blog" component={Blog} />
          <Route path="/store" component={Store} />
          <Route path="/forum" component={Forum} />
          <Route path="/services" component={Services} />
          <Route path="/tools" component={Tools} />
          <Route path="/assistant" component={Assistant} />
          <Route path="/assistant-result" component={AssistantResult} />
          <Route path="/voice-assistant" component={VoiceAssistant} />
          <Route path="/voice-assistant-result" component={VoiceAssistantResult} />
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