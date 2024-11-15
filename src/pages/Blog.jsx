import { useNavigate } from '@solidjs/router';

function Blog() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المدونة</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl">
        هنا ستجد أحدث المقالات والأخبار والمستجدات المتعلقة بـ <strong>Blind Accessibility</strong> وزيادة إمكانية الوصول.
      </p>
    </div>
  );
}

export default Blog;