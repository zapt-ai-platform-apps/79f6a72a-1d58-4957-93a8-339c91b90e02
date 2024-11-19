import { useNavigate, useLocation } from '@solidjs/router';

function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path) => {
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  };

  return (
    <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 text-gray-800">
      <div class="flex">
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/' ? 'text-primary border-t-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/')}
          disabled={location.pathname === '/'}
        >
          <span class="text-2xl">🏠</span>
          <span>الرئيسية</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/services' ? 'text-primary border-t-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/services')}
          disabled={location.pathname === '/services'}
        >
          <span class="text-2xl">🔧</span>
          <span>خدمات</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/tools' ? 'text-primary border-t-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/tools')}
          disabled={location.pathname === '/tools'}
        >
          <span class="text-2xl">🛠️</span>
          <span>أدوات</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/profile' ? 'text-primary border-t-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/profile')}
          disabled={location.pathname === '/profile'}
        >
          <span class="text-2xl">👤</span>
          <span>الملف الشخصي</span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNavBar;