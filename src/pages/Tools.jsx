import { useNavigate } from '@solidjs/router';

function Tools() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">أدوات</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl">
        هنا ستجد مجموعة من الأدوات المصممة لزيادة الإنتاجية وتحسين إمكانية الوصول.
      </p>
    </div>
  );
}

export default Tools;