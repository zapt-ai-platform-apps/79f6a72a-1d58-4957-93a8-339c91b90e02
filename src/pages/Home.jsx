import { useNavigate } from '@solidjs/router';

function Home() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">Blind Accessibility</h1>
      <p class="text-lg mb-4">تطبيق يشمل مجموعة من الأدوات الذكية لزيادة إمكانية الوصول.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
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
      </div>
    </div>
  );
}

export default Home;