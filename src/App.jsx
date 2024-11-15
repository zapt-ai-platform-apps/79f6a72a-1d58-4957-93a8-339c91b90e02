import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense } from 'solid-js';
import BottomNavBar from './components/BottomNavBar';

const Home = lazy(() => import('./pages/Home'));
const MainPage = lazy(() => import('./pages/MainPage'));
const Assistant = lazy(() => import('./components/Assistant'));
const AssistantConversation = lazy(() => import('./components/AssistantConversation'));
const SmartTextEditor = lazy(() => import('./components/SmartTextEditor'));
const ProcessedText = lazy(() => import('./components/ProcessedText'));
const Service = lazy(() => import('./pages/Service'));
const Blog = lazy(() => import('./pages/Blog'));
const Store = lazy(() => import('./pages/Store'));
const Forum = lazy(() => import('./pages/Forum'));

function App() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800 min-h-screen" dir="rtl">
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <Routes>
          <Route path="/" component={MainPage} />
          <Route path="/tools" component={Home} />
          <Route path="/assistant" component={Assistant} />
          <Route path="/assistant-conversation" component={AssistantConversation} />
          <Route path="/editor" component={SmartTextEditor} />
          <Route path="/processed-text" component={ProcessedText} />
          <Route path="/service" component={Service} />
          <Route path="/blog" component={Blog} />
          <Route path="/store" component={Store} />
          <Route path="/forum" component={Forum} />
        </Routes>
      </Suspense>
      <BottomNavBar />
    </div>
  );
}

export default App;