import { createSignal, createEffect, onMount, Show } from 'solid-js';
import { Routes, Route } from '@solidjs/router';
import Home from './pages/Home';
import MainPage from './pages/MainPage';
import Assistant from './components/Assistant';
import AssistantConversation from './components/AssistantConversation';
import SmartTextEditor from './components/SmartTextEditor';
import ProcessedText from './components/ProcessedText';
import AIContentCreator from './components/AIContentCreator';
import GeneratedContent from './components/GeneratedContent';
import Calculator from './components/Calculator';
import ResumeGenerator from './components/ResumeGenerator';
import GeneratedResume from './components/GeneratedResume';
import Service from './pages/Service';
import BottomNavBar from './components/BottomNavBar';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800 relative" dir="rtl">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">تسجيل الدخول باستخدام ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                تعرف على المزيد حول ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" component={MainPage} />
          <Route path="/tools" component={Home} />
          <Route path="/assistant" component={Assistant} />
          <Route path="/assistant-conversation" component={AssistantConversation} />
          <Route path="/editor" component={SmartTextEditor} />
          <Route path="/processed-text" component={ProcessedText} />
          <Route path="/content-creator" component={AIContentCreator} />
          <Route path="/generated-content" component={GeneratedContent} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/resume-generator" component={ResumeGenerator} />
          <Route path="/generated-resume" component={GeneratedResume} />
          <Route path="/service" component={Service} />
        </Routes>
        <BottomNavBar handleSignOut={handleSignOut} />
      </Show>
    </div>
  );
}

export default App;