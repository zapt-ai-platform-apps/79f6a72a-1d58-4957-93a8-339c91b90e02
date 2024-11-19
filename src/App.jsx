import { Routes, Route } from '@solidjs/router';
import { lazy, Suspense, createSignal, onMount, createEffect, Show } from 'solid-js';
import TopNavBar from './components/TopNavBar';
import BottomNavBar from './components/BottomNavBar';
import Loader from './components/Loader';
import { supabase } from './supabaseClient';

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
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-blue-100 to-white text-gray-800" dir="rtl">
      <Show when={user()} fallback={<Login />}>
        <TopNavBar />
        <div class="flex-grow pt-16 pb-16">
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
      </Show>
    </div>
  );
}

export default App;