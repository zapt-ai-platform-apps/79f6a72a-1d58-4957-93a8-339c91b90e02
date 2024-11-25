import { Routes, Route, Navigate } from '@solidjs/router';
import { lazy, Suspense, createSignal, onMount, onCleanup, Show } from 'solid-js';
import BottomNavBar from './components/BottomNavBar';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import NotificationProvider from './components/NotificationProvider';
import { supabase } from './supabaseClient';

const MainPage = lazy(() => import('./pages/MainPage'));
const Assistant = lazy(() => import('./pages/Assistant'));
const OrderYourApp = lazy(() => import('./pages/OrderYourApp'));
const OrderYourAppForm = lazy(() => import('./pages/OrderYourAppForm'));
const OrderYourWebsite = lazy(() => import('./pages/OrderYourWebsite'));
const Services = lazy(() => import('./pages/Services'));
const Tools = lazy(() => import('./pages/Tools'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const ContentResult = lazy(() => import('./pages/ContentResult'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const ResumeResult = lazy(() => import('./pages/ResumeResult'));
const Radio = lazy(() => import('./pages/Radio'));
const TextEditor = lazy(() => import('./pages/TextEditor'));
const TextResult = lazy(() => import('./pages/TextResult'));
const ImageGenerator = lazy(() => import('./pages/ImageGenerator'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Blog = lazy(() => import('./pages/Blog'));
const Store = lazy(() => import('./pages/Store'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const LearnMore = lazy(() => import('./pages/LearnMore'));
const UserAccount = lazy(() => import('./pages/UserAccount'));
const Settings = lazy(() => import('./pages/Settings'));
const EditProfile = lazy(() => import('./pages/EditProfile'));

function App() {
  const [user, setUser] = createSignal(null);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    onCleanup(() => {
      authListener?.unsubscribe();
    });
  });

  return (
    <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800" dir="rtl">
      <NotificationProvider>
        {loading() ? (
          <div class="flex items-center justify-center h-full"><Loader loading={true} /></div>
        ) : (
          <>
            <Show when={!user()}>
              <Routes>
                <Route path="/login" component={Login} />
                <Route path="/signup" component={SignUp} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/learn-more" component={LearnMore} />
                <Route path="/*" element={<Navigate href="/login" />} />
              </Routes>
            </Show>
            <Show when={user()}>
              <TopNavBar user={user} />
              <div class="flex-grow pb-16 h-full">
                <Suspense fallback={<div class="flex items-center justify-center h-full"><Loader loading={true} /></div>}>
                  <Routes>
                    <Route path="/" component={MainPage} />
                    <Route path="/assistant" component={Assistant} />
                    <Route path="/order-your-app" component={OrderYourApp} />
                    <Route path="/order-your-app-form" component={OrderYourAppForm} />
                    <Route path="/order-your-website" component={OrderYourWebsite} />
                    <Route path="/services" component={Services} />
                    <Route path="/tools" component={Tools} />
                    <Route path="/voice-assistant" component={VoiceAssistant} />
                    <Route path="/content-generator" component={ContentGenerator} />
                    <Route path="/content-result" component={ContentResult} />
                    <Route path="/resume-builder" component={ResumeBuilder} />
                    <Route path="/resume-result" component={ResumeResult} />
                    <Route path="/radio" component={Radio} />
                    <Route path="/text-editor" component={TextEditor} />
                    <Route path="/text-result" component={TextResult} />
                    <Route path="/image-generator" component={ImageGenerator} />
                    <Route path="/contact-us" component={ContactUs} />
                    <Route path="/blog" component={Blog} />
                    <Route path="/store" component={Store} />
                    <Route path="/user-account" component={UserAccount} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/edit-profile" component={EditProfile} />
                    <Route path="/*" element={<Navigate href="/" />} />
                  </Routes>
                </Suspense>
              </div>
              <BottomNavBar user={user} />
            </Show>
          </>
        )}
      </NotificationProvider>
      <Footer user={user} />
    </div>
  );
}

export default App;