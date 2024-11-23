import { useNavigate, useLocation } from '@solidjs/router';
import { Show } from 'solid-js';

function BottomNavBar(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path) => {
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  };

  const isAdmin = () => {
    return props.user() && props.user().email === 'daoudi.abdennour@gmail.com';
  };

  return (
    <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 text-gray-800">
      <div class="flex">
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/' ? 'text-primary border-t-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/')}
        >
          <span class="text-2xl">🏠</span>
          <span>الرئيسية</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/services' ? 'text-primary border-t-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/services')}
        >
          <span class="text-2xl">🔧</span>
          <span>خدمات</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/tools' ? 'text-primary border-t-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/tools')}
        >
          <span class="text-2xl">🛠️</span>
          <span>أدوات</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/profile' ? 'text-primary border-t-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/profile')}
        >
          <span class="text-2xl">👤</span>
          <span>الملف الشخصي</span>
        </button>
        <Show when={isAdmin()}>
          <button
            class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
              location.pathname === '/admin' ? 'text-primary border-t-2 border-primary' : ''
            }`}
            onClick={() => navigateTo('/admin')}
          >
            <span class="text-2xl">⚙️</span>
            <span>لوحة التحكم</span>
          </button>
        </Show>
      </div>
    </nav>
  );
}

export default BottomNavBar;