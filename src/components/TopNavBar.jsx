import { createSignal, Show, onMount } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function TopNavBar() {
  const [showMenu, setShowMenu] = createSignal(false);
  const [user, setUser] = createSignal(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu());
  };

  onMount(async () => {
    const { data: { user: currentUser }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
    } else {
      setUser(currentUser);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Cleanup the listener when component is unmounted
    onCleanup(() => {
      authListener.subscription.unsubscribe();
    });
  });

  return (
    <div class="w-full flex flex-col items-center p-4 bg-white border-b border-gray-300">
      <button
        onClick={toggleMenu}
        class="mb-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300 cursor-pointer"
      >
        قائمة التنقل
      </button>
      <Show when={showMenu()}>
        <div class="flex space-x-reverse space-x-4">
          <button
            onClick={() => navigate('/')}
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            الرئيسية
          </button>
          <button
            onClick={() => navigate('/contact-us')}
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
          >
            اتصل بنا
          </button>
          <button
            onClick={() => navigate('/join-the-team')}
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
          >
            انضم للفريق
          </button>
          <Show when={user() && user().email === 'daoudi.abdennour@gmail.com'}>
            <a
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
            >
              Made on ZAPT
            </a>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default TopNavBar;