import { Show } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function TopNavBar(props) {
  const [showMenu, setShowMenu] = createSignal(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu());
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

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
          <Show when={props.user && props.user.email === 'daoudi.abdennour@gmail.com'}>
            <a
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
            >
              Made on ZAPT
            </a>
          </Show>
          <Show when={props.user}>
            <button
              onClick={handleSignOut}
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
            >
              تسجيل الخروج
            </button>
          </Show>
          <Show when={!props.user}>
            <button
              onClick={() => navigate('/login')}
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              تسجيل الدخول
            </button>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default TopNavBar;