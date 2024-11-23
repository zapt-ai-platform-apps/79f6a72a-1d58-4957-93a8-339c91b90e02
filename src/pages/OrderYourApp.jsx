import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

function OrderYourApp() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = createSignal('');

  const packages = [
    {
      name: 'الباقة المجانية',
      price: '0 دولار سنويًا',
      features: [
        'تحتوي على إعلانات وحقوق المنشئ',
        'لوحة تحكم أساسية',
      ],
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      value: 'free',
    },
    {
      name: 'الباقة الأساسية',
      price: '10 دولارات سنويًا',
      features: [
        'إزالة الإعلانات وحقوق المنشئ',
        'لوحة تحكم متقدمة',
        'ميزات إضافية',
      ],
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      value: 'basic',
    },
    {
      name: 'الباقة الاحترافية',
      price: '50 دولارًا سنويًا',
      features: [
        'جميع مميزات الباقة الأساسية',
        'تخصيصات متقدمة',
        'تكاملات إضافية',
        'دعم فني على مدار الساعة',
      ],
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      value: 'professional',
    },
  ];

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate('/services')}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
      >
        🔙
      </button>
      <h1 class="text-5xl font-bold text-purple-600 mb-6">✨ اطلب تطبيقك الخاص ✨</h1>
      <p class="text-xl text-center leading-relaxed max-w-3xl mb-8">
        🌟 انطلق في رحلتك الرقمية معنا! اطلب تطبيقك الخاص المتوافق مع قارئات الشاشة للمكفوفين. نحن ندعم جميع المشاريع ونقدم خدمات تناسب احتياجاتك لتحقيق رؤيتك.
      </p>

      <h2 class="text-3xl font-bold text-purple-600 mb-6">اختر الباقة المثالية لك:</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {packages.map((pkg) => (
          <div
            class="border border-gray-300 rounded-lg p-6 text-center shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            <h3 class="text-2xl font-bold mb-2">{pkg.name}</h3>
            <p class="text-xl text-gray-700 mb-4">{pkg.price}</p>
            <ul class="text-left mb-6">
              {pkg.features.map((feature) => (
                <li class="mb-2 flex items-center">
                  <span class="text-green-500 mr-2">✔️</span>{feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate(`/order-your-app-form?package=${pkg.value}`)}
              class={`mt-4 w-full px-6 py-3 ${pkg.bgColor} ${pkg.hoverColor} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
            >
              ابدأ الآن
            </button>
          </div>
        ))}
      </div>

      <div class="mt-12 text-center">
        <h2 class="text-4xl font-bold text-purple-600 mb-4">لماذا تختار خدمتنا؟</h2>
        <p class="text-lg leading-relaxed max-w-3xl mb-6">
          💡 نحن ملتزمون بتقديم أفضل الحلول والتقنيات لمساعدتك في تحقيق أهدافك. انضم إلى مجموعة من العملاء الراضين وابدأ رحلتك معنا اليوم!
        </p>
        <div class="flex flex-wrap justify-center space-x-reverse space-x-6">
          <div class="flex items-center mb-4">
            <span class="text-3xl text-green-500 mr-2">🎨</span>
            <span class="text-xl">تصميمات احترافية</span>
          </div>
          <div class="flex items-center mb-4">
            <span class="text-3xl text-green-500 mr-2">🛠️</span>
            <span class="text-xl">تطوير مخصص</span>
          </div>
          <div class="flex items-center mb-4">
            <span class="text-3xl text-green-500 mr-2">⚙️</span>
            <span class="text-xl">تكامل سلس</span>
          </div>
          <div class="flex items-center mb-4">
            <span class="text-3xl text-green-500 mr-2">💻</span>
            <span class="text-xl">توافق مثالي</span>
          </div>
          <div class="flex items-center mb-4">
            <span class="text-3xl text-green-500 mr-2">📞</span>
            <span class="text-xl">دعم مستمر</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderYourApp;