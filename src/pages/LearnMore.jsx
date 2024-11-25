import { useNavigate } from '@solidjs/router';

function LearnMore() {
  const navigate = useNavigate();

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      {/* زر العودة */}
      <button
        onClick={() => navigate('/login')}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
      >
        🔙
      </button>

      {/* القسم الرئيسي */}
      <div class="text-center">
        <h1 class="text-5xl font-bold text-purple-600 mb-6">
          👁️‍🗨️ Blind Accessibility
        </h1>
        <p class="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
          تطبيق شامل مصمم خصيصًا لتعزيز إمكانية الوصول للأشخاص ذوي الإعاقة البصرية.
          نجعل الحياة اليومية أسهل وأكثر استقلالية من خلال حلول مبتكرة تعتمد على تقنيات الذكاء الاصطناعي.
        </p>
      </div>

      {/* قسم المميزات */}
      <div class="w-full max-w-4xl">
        <h2 class="text-3xl font-bold text-purple-600 mb-6 text-center">
          مميزات التطبيق
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <h3 class="text-2xl font-bold text-purple-600 mb-4">
              📱 المساعد الذكي
            </h3>
            <p class="text-gray-700 leading-relaxed">
              احصل على إجابات فورية على أسئلتك باستخدام الذكاء الاصطناعي المتقدم.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <h3 class="text-2xl font-bold text-purple-600 mb-4">
              🎙️ المساعد الصوتي
            </h3>
            <p class="text-gray-700 leading-relaxed">
              تفاعل مع التطبيق باستخدام الأوامر الصوتية بسهولة وبدون الحاجة للكتابة.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <h3 class="text-2xl font-bold text-purple-600 mb-4">
              📝 إنشاء السيرة الذاتية
            </h3>
            <p class="text-gray-700 leading-relaxed">
              قم بإنشاء سيرة ذاتية احترافية وجاهزة للتنزيل خلال دقائق قليلة.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <h3 class="text-2xl font-bold text-purple-600 mb-4">
              🖊️ تحرير النصوص
            </h3>
            <p class="text-gray-700 leading-relaxed">
              قم بمعالجة النصوص مثل التلخيص، التصحيح، والترجمة بسهولة تامة.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <h3 class="text-2xl font-bold text-purple-600 mb-4">
              📻 الراديو العربي
            </h3>
            <p class="text-gray-700 leading-relaxed">
              استمع إلى محطات الراديو العربية من مختلف الدول مباشرة من خلال التطبيق.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <h3 class="text-2xl font-bold text-purple-600 mb-4">
              🖼️ منشئ الصور الاحترافي
            </h3>
            <p class="text-gray-700 leading-relaxed">
              أنشئ صورًا فريدة باستخدام وصف نصي باستخدام تقنية الذكاء الاصطناعي.
            </p>
          </div>
        </div>
      </div>

      {/* دعوة إلى العمل */}
      <div class="mt-12 text-center">
        <h2 class="text-4xl font-bold text-purple-600 mb-6">
          ابدأ رحلتك معنا اليوم!
        </h2>
        <p class="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
          انضم إلى مجتمعنا واستفد من مجموعة واسعة من الأدوات والخدمات المصممة خصيصًا لك.
        </p>
        <button
          onClick={() => navigate('/signup')}
          class="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          إنشاء حساب جديد
        </button>
      </div>

      {/* روابط شبكات التواصل الاجتماعي */}
      <div class="mt-12">
        <h2 class="text-3xl font-bold text-purple-600 mb-4 text-center">
          تابعنا على شبكات التواصل الاجتماعي
        </h2>
        <div class="flex justify-center space-x-reverse space-x-6">
          {/* أيقونات التواصل الاجتماعي */}
          <a
            href="https://www.facebook.com/profile.php?id=61550796732035"
            target="_blank"
            rel="noopener noreferrer"
            class="cursor-pointer transform hover:scale-110 transition duration-300 ease-in-out"
          >
            <img src="https://images.unsplash.com/photo-1611262588024-d12430b98920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw1fHxGYWNlYm9vayUyMGxvZ28lMjBpY29ufGVufDB8fHx8MTczMjU3MzY2N3ww&ixlib=rb-4.0.3&q=80&w=1080"
              
              alt="فيسبوك"
              class="w-12 h-12"
              data-image-request="Facebook logo icon"
            />
          </a>
          <a
            href="https://t.me/Blindaccessibilitybot"
            target="_blank"
            rel="noopener noreferrer"
            class="cursor-pointer transform hover:scale-110 transition duration-300 ease-in-out"
          >
            <img src="https://images.unsplash.com/photo-1615915468538-0fbd857888ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw0fHxUZWxlZ3JhbSUyMGxvZ28lMjBpY29ufGVufDB8fHx8MTczMjU3MzY2N3ww&ixlib=rb-4.0.3&q=80&w=1080"
              
              alt="تيليجرام"
              class="w-12 h-12"
              data-image-request="Telegram logo icon"
            />
          </a>
          <a
            href="https://chat.whatsapp.com/CVW8aHib2SKIXlTroXMxYH"
            target="_blank"
            rel="noopener noreferrer"
            class="cursor-pointer transform hover:scale-110 transition duration-300 ease-in-out"
          >
            <img src="https://images.unsplash.com/photo-1611605698335-8b1569810432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw2fHxXaGF0c0FwcCUyMGxvZ28lMjBpY29ufGVufDB8fHx8MTczMjU3MzY2OHww&ixlib=rb-4.0.3&q=80&w=1080"
              
              alt="واتساب"
              class="w-12 h-12"
              data-image-request="WhatsApp logo icon"
            />
          </a>
        </div>
      </div>

      {/* الفوتر */}
      <div class="mt-12 text-center">
        <p class="text-gray-600">
          © 2023 Blind Accessibility. جميع الحقوق محفوظة.
        </p>
        <a
          href="https://www.zapt.ai"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-500 hover:underline mt-2 inline-block"
        >
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}

export default LearnMore;