import { createSignal, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import BackButton from '../components/BackButton';

function Shop() {
  const navigate = useNavigate();
  const [products] = createSignal([
    { id: 1, name: 'قارئ شاشة متقدم', price: '$99', description: 'تقنيات حديثة لتحسين الوصول.' },
    { id: 2, name: 'سماعات رأس بتقنية عالية', price: '$49', description: 'جودة صوت ممتازة وتجربة مريحة.' },
    { id: 3, name: 'لوحة مفاتيح برايل', price: '$150', description: 'تكنولوجيا برايل للمكفوفين.' },
    { id: 4, name: 'هاتف ذكي متوافق مع الوصول', price: '$299', description: 'ميزات متقدمة لتسهيل الاستخدام.' },
  ]);

  const handleProductClick = (id) => {
    // يمكنك إضافة التنقل إلى تفاصيل المنتج هنا
    // navigate(`/shop/product/${id}`);
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <BackButton />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المتجر</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        تصفح واشتري أحدث المنتجات المصممة لتعزيز إمكانية الوصول.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <For each={products()}>
          {(product) => (
            <div
              class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <h2 class="text-2xl font-bold mb-2 text-purple-600">{product.name}</h2>
              <p class="text-gray-700 mb-2">{product.description}</p>
              <p class="text-xl font-semibold text-green-600">{product.price}</p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default Shop;