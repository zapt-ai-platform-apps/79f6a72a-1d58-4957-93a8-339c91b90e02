import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense } from 'solid-js';
import BottomNavBar from './components/BottomNavBar';

const MainPage = lazy(() => import('./pages/MainPage'));
const Blog = lazy(() => import('./pages/Blog'));
const Store = lazy(() => import('./pages/Store'));
const Forum = lazy(() => import('./pages/Forum'));

function App() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800" dir="rtl">
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <Routes>
          <Route path="/" component={MainPage} />
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