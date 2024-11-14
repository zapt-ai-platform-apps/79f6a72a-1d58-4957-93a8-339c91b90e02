import { useNavigate } from '@solidjs/router';

function Home() {
  const navigate = useNavigate();

  const tools = [
    { name: 'المساعد الصوتي', path: '/assistant' },
    { name: 'محرر النصوص الذكي', path: '/editor' },
    { name: 'منشئ المحتوى', path: '/content-creator' },
    { name: 'الراديو العربي', path: '/radio' },
    { name: 'وصف الصور', path: '/image-describer' },
  ];

  return (
    <div class="flex flex-col items-center justify-center h-full p-4 text-gray-800">
      <h1 class="text-5xl font-bold text-purple-600 mb-8">أدوات Blind Accessibility</h1>
      <p class="text-xl mb-6 text-center max-w-2xl">
        تطبيق لتعزيز الوصول الرقمي للأشخاص المكفوفين وضعاف البصر، يتضمن مجموعة من الأدوات المتقدمة لسهولة الاستخدام وتحسين الإنتاجية.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <For each={tools}>
          {(tool) => (
            <button
              onClick={() => navigate(tool.path)}
              class="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer text-xl font-semibold"
            >
              {tool.name}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

export default Home;