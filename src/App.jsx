import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense, createSignal, onMount, createEffect, Show } from 'solid-js';
import TopNavBar from './components/TopNavBar';
import BottomNavBar from './components/BottomNavBar';
import Loader from './components/Loader';
import { supabase } from './supabaseClient';
import NotificationProvider from './components/NotificationProvider';
import Login from './pages/Login';

const MainPage = lazy(() => import('./pages/MainPage'));
// ... other page imports

function App() {
  const [user, setUser] = createSignal(null);
  const [showTopNavBar, setShowTopNavBar] = createSignal(false);

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  });

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  });

  return (
    <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800" dir="rtl">
      <NotificationProvider>
        <Show when={user()} fallback={<Login />}>
          <button
            class="fixed top-2 right-2 z-20 bg-blue-500 text-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            onClick={() => setShowTopNavBar(!showTopNavBar())}
            aria-label="تبديل القائمة"
          >
            <Show when={showTopNavBar()} fallback="☰">×</Show>
          </button>
          <Show when={showTopNavBar()}>
            <TopNavBar user={user} />
          </Show>
          <div class={`flex-grow ${showTopNavBar() ? 'pt-16' : ''} pb-16 h-full`}>
            <Suspense fallback={<div class="flex items-center justify-center h-full"><Loader loading={true} /></div>}>
              <Routes>
                <Route path="/" component={MainPage} />
                {/* ... other routes */}
              </Routes>
            </Suspense>
          </div>
          <BottomNavBar user={user} />
        </Show>
      </NotificationProvider>
    </div>
  );
}

export default App;