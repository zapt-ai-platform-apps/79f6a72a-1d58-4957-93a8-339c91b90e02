import { useNavigate } from '@solidjs/router';

function Settings() {
  const navigate = useNavigate();

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الإعدادات</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        هنا يمكنك تعديل إعدادات التطبيق لتناسب احتياجاتك.
      </p>
      {/* يمكنك إضافة خيارات الإعدادات هنا */}
    </div>
  );
}

export default Settings;