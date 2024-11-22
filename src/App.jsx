import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense, createSignal, onMount, createEffect, Show } from 'solid-js';
import TopNavBar from './components/TopNavBar';
import BottomNavBar from './components/BottomNavBar';
import Loader from './components/Loader';
import { supabase } from './supabaseClient';
import MadeOnZapt from './components/MadeOnZapt';
import NotificationProvider from './components/NotificationProvider';
import { useSettings } from './contexts/SettingsContext';

const MainPage = lazy(() => import('./pages/MainPage'));
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
const Radio = lazy(() => import('./pages/Radio'));
const CreateYourApp = lazy(() => import('./pages/CreateYourApp'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  const [user, setUser] = createSignal(null);
  const [showTopNavBar, setShowTopNavBar] = createSignal(false);

  const { theme, setTheme, fontSize, setFontSize } = useSettings();

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const metadata = user.user_metadata || {};
      setTheme(metadata.theme || 'light');
      setFontSize(metadata.fontSize || 'medium');
    }
  });

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const metadata = session.user.user_metadata || {};
        setTheme(metadata.theme || 'light');
        setFontSize(metadata.fontSize || 'medium');
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  });

  const fontSizeClass = () => {
    switch (fontSize()) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div class={`${theme() === 'dark' ? 'dark' : ''} h-full`}>
      <div class={`h-full flex flex-col bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 ${fontSizeClass()}`} dir="rtl">
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
                  <Route path="/radio" component={Radio} />
                  <Route path="/create-your-app" component={CreateYourApp} />
                  <Route path="/contact-us" component={ContactUs} />
                  <Route path="/profile" component={Profile} />
                </Routes>
              </Suspense>
            </div>
            <BottomNavBar />
            <MadeOnZapt />
          </Show>
        </NotificationProvider>
      </div>
    </div>
  );
}

export default App;