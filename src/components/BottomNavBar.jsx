import { useNavigate, useLocation } from '@solidjs/router';

function BottomNavBar(props) {
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
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer`}
          classList={{ 'text-primary border-t-2 border-primary': location.pathname === '/' }}
          onClick={() => navigateTo('/')}
        >
          <span class="text-2xl">🏠</span>
          <span>الرئيسية</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer`}
          classList={{ 'text-primary border-t-2 border-primary': location.pathname === '/services' }}
          onClick={() => navigateTo('/services')}
        >
          <span class="text-2xl">🔧</span>
          <span>خدمات</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer`}
          classList={{ 'text-primary border-t-2 border-primary': location.pathname === '/tools' }}
          onClick={() => navigateTo('/tools')}
        >
          <span class="text-2xl">🛠️</span>
          <span>أدوات</span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNavBar;