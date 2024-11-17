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
      <div class="flex justify-around">
        <div
          class={`flex flex-col items-center py-2 cursor-pointer hover:text-primary ${
            location.pathname === '/' ? 'text-primary' : ''
          }`}
          onClick={() => navigateTo('/')}
        >
          <span class="text-2xl">🏠</span>
          <span>الرئيسية</span>
        </div>
        <div
          class={`flex flex-col items-center py-2 cursor-pointer hover:text-primary ${
            location.pathname === '/services' ? 'text-primary' : ''
          }`}
          onClick={() => navigateTo('/services')}
        >
          <span class="text-2xl">🔧</span>
          <span>خدمات</span>
        </div>
        <div
          class={`flex flex-col items-center py-2 cursor-pointer hover:text-primary ${
            location.pathname === '/tools' ? 'text-primary' : ''
          }`}
          onClick={() => navigateTo('/tools')}
        >
          <span class="text-2xl">🛠️</span>
          <span>أدوات</span>
        </div>
      </div>
    </nav>
  );
}

export default BottomNavBar;