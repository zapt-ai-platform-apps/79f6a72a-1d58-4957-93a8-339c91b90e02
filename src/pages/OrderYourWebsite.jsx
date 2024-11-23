import { useNavigate } from '@solidjs/router';

function OrderYourWebsite() {
  const navigate = useNavigate();

  const packages = [
    {
      name: 'الباقة الأساسية',
      price: '20 دولارًا سنويًا',
      features: [
        'تصميم موقع بسيط',
        'توافق مع قارئات الشاشة',
        'دعم فني لمدة سنة',
      ],
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      name: 'الباقة المتقدمة',
      price: '50 دولارًا سنويًا',
      features: [
        'تصميم موقع مخصص',
        'ميزات تفاعلية متقدمة',
        'توافق كامل مع جميع الأجهزة',
        'دعم فني لمدة سنتين',
      ],
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      name: 'الباقة الاحترافية',
      price: '100 دولار سنويًا',
      features: [
        'تصميم موقع حسب الطلب',
        'تطوير ميزات مخصصة',
        'تحسين SEO',
        'دعم وإدارة الموقع',
      ],
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
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
      <h1 class="text-5xl font-bold text-purple-600 mb-6">✨ اطلب موقعك الخاص ✨</h1>
      <p class="text-xl text-center leading-relaxed max-w-3xl mb-8">
        🌟 انطلق في عالمك الرقمي الخاص من خلال موقع إلكتروني يعكس رؤيتك ويلبي احتياجاتك.
        نحن نقدم تصميمات مخصصة ومتوافقة مع قارئات الشاشة لضمان تجربة مستخدم مثالية.
      </p>

      <h2 class="text-3xl font-bold text-purple-600 mb-6">اختر الباقة المناسبة لك:</h2>
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
              onClick={() => navigate('/contact-us')}
              class={`mt-4 w-full px-6 py-3 ${pkg.bgColor} ${pkg.hoverColor} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
            >
              اطلب الآن
            </button>
          </div>
        ))}
      </div>

      <div class="mt-12 text-center">
        <h2 class="text-4xl font-bold text-purple-600 mb-4">لماذا تختار خدمتنا؟</h2>
        <p class="text-lg leading-relaxed max-w-3xl mb-6">
          💡 نحن ملتزمون بتقديم أفضل الحلول والتقنيات لمساعدتك في تحقيق أهدافك الرقمية.
          انضم إلى مجموعة من العملاء الراضين وابدأ رحلتك معنا اليوم!
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
            <span class="text-xl">تكاملات متقدمة</span>
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

export default OrderYourWebsite;