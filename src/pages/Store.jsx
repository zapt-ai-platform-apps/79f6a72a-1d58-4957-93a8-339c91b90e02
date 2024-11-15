import { useNavigate } from '@solidjs/router';

function Store() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المتجر</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl">
        تصفح منتجاتنا وأدواتنا المصممة لزيادة إمكانية الوصول وتحسين تجربتك الرقمية.
      </p>
    </div>
  );
}

export default Store;