import { useNavigate } from '@solidjs/router';

function Home() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">أدوات Blind Accessibility</h1>
      <p class="text-lg mb-4">تطبيق لتعزيز الوصول الرقمي للأشخاص المكفوفين وضعاف البصر.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
        <button
          onClick={() => navigate('/assistant')}
          class="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المساعد الصوتي
        </button>
        <button
          onClick={() => navigate('/editor')}
          class="bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          محرر النصوص الذكي
        </button>
        <button
          onClick={() => navigate('/content-creator')}
          class="bg-purple-500 text-white py-4 px-6 rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          منشئ المحتوى
        </button>
        <button
          onClick={() => navigate('/radio')}
          class="bg-red-500 text-white py-4 px-6 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          الراديو العربي
        </button>
        <button
          onClick={() => navigate('/calculator')}
          class="bg-yellow-500 text-white py-4 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          الآلة الحاسبة
        </button>
        <button
          onClick={() => navigate('/image-text-extractor')}
          class="bg-teal-500 text-white py-4 px-6 rounded-lg hover:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          استخراج النص من الصورة
        </button>
      </div>
    </div>
  );
}

export default Home;