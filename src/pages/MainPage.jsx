import { useNavigate } from '@solidjs/router';
import SocialMediaLinks from '../components/SocialMediaLinks';

function MainPage() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 min-h-screen pt-16 pb-16">
      <h1 class="text-5xl font-bold text-purple-600 mb-6">Blind Accessibility</h1>
      <p class="text-center max-w-2xl text-lg leading-relaxed mb-8 text-gray-800">
        اكتشف حلولًا مبتكرة تزيد إنتاجيتك وتعزز إمكانية وصولك. ابدأ الآن رحلتك نحو تجربة رقمية أفضل!
      </p>

      <div class="grid grid-cols-1 gap-4 w-full max-w-md mt-6">
        <button
          onClick={() => navigate('/blog')}
          class="bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المدونة
        </button>
        <button
          onClick={() => navigate('/shop')}
          class="bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المتجر
        </button>
      </div>

      <div class="mt-8 text-center">
        <h2 class="text-3xl font-bold text-purple-600 mb-4">انضم إلى فريقنا</h2>
        <p class="text-lg leading-relaxed max-w-2xl mb-4">
          نحن نبحث عن أفراد موهوبين وشغوفين للانضمام إلى فريقنا والمساهمة في تحسين إمكانية الوصول للجميع.
          إذا كنت ترغب في المشاركة والتميز، تواصل معنا الآن!
        </p>
        <button
          onClick={() => navigate('/join-us')}
          class="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          انضم إلينا
        </button>
      </div>

      <SocialMediaLinks />
    </div>
  );
}

export default MainPage;