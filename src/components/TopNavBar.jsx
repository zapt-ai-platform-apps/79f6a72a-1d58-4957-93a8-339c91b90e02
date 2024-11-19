import { useNavigate, useLocation } from '@solidjs/router';

function TopNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path) => {
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  };

  return (
    <nav class="fixed top-0 left-0 w-full bg-white border-b border-gray-300 text-gray-800 z-10">
      <div class="flex">
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/' ? 'text-primary border-b-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/')}
        >
          <span class="text-2xl">🏠</span>
          <span>الرئيسية</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/join-us' ? 'text-primary border-b-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/join-us')}
        >
          <span class="text-2xl">🤝</span>
          <span>انضم للفريق</span>
        </button>
        <button
          class={`flex-1 flex flex-col items-center py-2 cursor-pointer ${
            location.pathname === '/contact-us' ? 'text-primary border-b-2 border-primary' : ''
          }`}
          onClick={() => navigateTo('/contact-us')}
        >
          <span class="text-2xl">📞</span>
          <span>اتصل بنا</span>
        </button>
      </div>
    </nav>
  );
}

export default TopNavBar;