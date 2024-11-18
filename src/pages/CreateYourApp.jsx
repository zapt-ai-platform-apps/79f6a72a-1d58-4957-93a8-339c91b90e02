import { useNavigate } from '@solidjs/router';

function CreateYourApp() {
  const navigate = useNavigate();

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate('/services')}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">إنشاء تطبيقك الخاص</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        قم بإنشاء تطبيقك الخاص المتوافق مع قارئات الشاشة للمكفوفين. نحن ندعم جميع المشاريع ونقدم خدمات تناسب احتياجاتك.
      </p>

      <h2 class="text-3xl font-bold text-purple-600 mb-4">اختر الباقة المناسبة:</h2>
      <div class="grid grid-cols-1 gap-6 w-full max-w-md">
        {/* Free Package */}
        <div class="border border-gray-300 rounded-lg p-6 text-center">
          <h3 class="text-2xl font-bold mb-2">الباقة المجانية (0 دولار سنويًا)</h3>
          <p class="mb-4">تحتوي على إعلانات وحقوق المنشئ. لوحة التحكم محدودة.</p>
          <button
            onClick={() => navigate('/contact-us?package=free')}
            class="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            ابدأ الآن
          </button>
        </div>
        {/* Basic Package */}
        <div class="border border-gray-300 rounded-lg p-6 text-center">
          <h3 class="text-2xl font-bold mb-2">الباقة الأساسية (10 دولارات سنويًا)</h3>
          <p class="mb-4">إزالة الإعلانات وحقوق المنشئ. لوحة تحكم متقدمة.</p>
          <button
            onClick={() => navigate('/contact-us?package=basic')}
            class="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            ابدأ الآن
          </button>
        </div>
        {/* Professional Package */}
        <div class="border border-gray-300 rounded-lg p-6 text-center">
          <h3 class="text-2xl font-bold mb-2">الباقة الاحترافية (50 دولارًا سنويًا)</h3>
          <p class="mb-4">جميع مميزات الباقة الأساسية. تخصيصات متقدمة وتكاملات إضافية. دعم فني على مدار الساعة.</p>
          <button
            onClick={() => navigate('/contact-us?package=professional')}
            class="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            ابدأ الآن
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateYourApp;