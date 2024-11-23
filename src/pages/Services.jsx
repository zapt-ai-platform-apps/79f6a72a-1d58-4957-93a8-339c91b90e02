import { useNavigate } from '@solidjs/router';

function Services() {
  const navigate = useNavigate();

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">خدمات</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        اكتشف خدماتنا المتميزة المصممة خصيصًا لتسهيل حياتك الرقمية وتعزيز إمكانية الوصول بكفاءة وفعالية.
      </p>

      <div class="grid grid-cols-1 gap-4 w-full max-w-md mt-6">
        <button
          onClick={() => navigate('/create-your-app')}
          class="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          إنشاء تطبيقك الخاص
        </button>
        <button
          onClick={() => navigate('/order-your-website')}
          class="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          اطلب موقعك الخاص
        </button>
      </div>
    </div>
  );
}

export default Services;