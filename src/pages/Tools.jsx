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
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        هنا ستجد مجموعة من الأدوات المصممة لزيادة الإنتاجية وتحسين إمكانية الوصول.
      </p>

      <div class="grid grid-cols-1 gap-4 w-full max-w-md mt-6">
        <button
          onClick={() => navigate('/assistant')}
          class="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المساعد الذكي
        </button>
        {/* يمكن إضافة أدوات أخرى هنا */}
      </div>
    </div>
  );
}

export default Tools;