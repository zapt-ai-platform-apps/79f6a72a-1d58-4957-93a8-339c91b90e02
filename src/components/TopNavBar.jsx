import { useNavigate, useLocation } from '@solidjs/router';

function TopNavBar(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path) => {
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  };

  return (
    <nav class="fixed top-0 right-0 w-2/3 max-w-xs bg-white border-l border-gray-300 text-gray-800 z-20 h-full shadow-lg">
      <div class="flex flex-col h-full">
        <button
          class={`flex items-center py-4 px-6 text-left text-lg cursor-pointer hover:bg-gray-100`}
          classList={{ 'text-primary': location.pathname === '/' }}
          onClick={() => navigateTo('/')}
        >
          <span class="text-2xl mr-4">🏠</span>
          <span>الرئيسية</span>
        </button>
        <button
          class={`flex items-center py-4 px-6 text-left text-lg cursor-pointer hover:bg-gray-100`}
          classList={{ 'text-primary': location.pathname === '/join-us' }}
          onClick={() => navigateTo('/join-us')}
        >
          <span class="text-2xl mr-4">🤝</span>
          <span>انضم للفريق</span>
        </button>
        <button
          class={`flex items-center py-4 px-6 text-left text-lg cursor-pointer hover:bg-gray-100`}
          classList={{ 'text-primary': location.pathname === '/contact-us' }}
          onClick={() => navigateTo('/contact-us')}
        >
          <span class="text-2xl mr-4">📞</span>
          <span>اتصل بنا</span>
        </button>
        <div class="mt-auto mb-4 px-6">
          <a
            href="https://www.zapt.ai"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-500 hover:underline cursor-pointer"
          >
            Made on ZAPT
          </a>
        </div>
      </div>
    </nav>
  );
}

export default TopNavBar;