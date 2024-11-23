import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense, createSignal, onMount, createEffect, Show } from 'solid-js';
import TopNavBar from './components/TopNavBar';
import BottomNavBar from './components/BottomNavBar';
import Loader from './components/Loader';
import { supabase } from './supabaseClient';
import NotificationProvider from './components/NotificationProvider';

const MainPage = lazy(() => import('./pages/MainPage'));
const Login = lazy(() => import('./pages/Login'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CreateYourApp = lazy(() => import('./pages/CreateYourApp'));
const JoinUs = lazy(() => import('./pages/JoinUs'));
const Messages = lazy(() => import('./pages/Messages'));
const Profile = lazy(() => import('./pages/Profile'));
const Services = lazy(() => import('./pages/Services'));
const Settings = lazy(() => import('./pages/Settings'));
const Tools = lazy(() => import('./pages/Tools'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const ContentResult = lazy(() => import('./pages/ContentResult'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const ResumeResult = lazy(() => import('./pages/ResumeResult'));
const Radio = lazy(() => import('./pages/Radio'));
const TextEditor = lazy(() => import('./pages/TextEditor'));
const TextResult = lazy(() => import('./pages/TextResult'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

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
          <>
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
                  <Route path="/assistant" component={Assistant} />
                  <Route path="/blog" component={Blog} />
                  <Route path="/blog/:id" component={BlogPost} />
                  <Route path="/create-your-app" component={CreateYourApp} />
                  <Route path="/join-us" component={JoinUs} />
                  <Route path="/messages" component={Messages} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/services" component={Services} />
                  <Route path="/settings" component={Settings} />
                  <Route path="/tools" component={Tools} />
                  <Route path="/voice-assistant" component={VoiceAssistant} />
                  <Route path="/content-generator" component={ContentGenerator} />
                  <Route path="/content-result" component={ContentResult} />
                  <Route path="/resume-builder" component={ResumeBuilder} />
                  <Route path="/resume-result" component={ResumeResult} />
                  <Route path="/radio" component={Radio} />
                  <Route path="/text-editor" component={TextEditor} />
                  <Route path="/text-result" component={TextResult} />
                  <Route path="/admin" component={AdminDashboard} />
                </Routes>
              </Suspense>
            </div>
            <BottomNavBar user={user} />
          </>
        </Show>
      </NotificationProvider>
    </div>
  );
}

export default App;