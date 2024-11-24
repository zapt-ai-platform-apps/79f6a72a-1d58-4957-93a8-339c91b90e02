import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

function Services() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = createSignal('');

  const handleSelectionChange = (e) => {
    const value = e.target.value;
    setSelectedService(value);
    if (value) {
      navigate(value);
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">خدمات</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        اكتشف خدماتنا المتميزة المصممة خصيصًا لتسهيل حياتك الرقمية وتعزيز إمكانية الوصول بكفاءة وفعالية.
      </p>

      <div class="w-full max-w-md mt-6">
        <label class="block mb-2 text-lg font-semibold">اختر الخدمة:</label>
        <select
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
          value={selectedService()}
          onInput={handleSelectionChange}
        >
          <option value="">-- اختر الخدمة --</option>
          <option value="/order-your-app">اطلب تطبيقك الخاص</option>
          <option value="/order-your-website">اطلب موقعك الخاص</option>
        </select>
      </div>
    </div>
  );
}

export default Services;