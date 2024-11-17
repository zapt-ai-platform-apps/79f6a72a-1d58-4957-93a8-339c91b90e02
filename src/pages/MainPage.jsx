import { useNavigate } from '@solidjs/router';
import SocialMediaLinks from '../components/SocialMediaLinks';

function MainPage() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 min-h-screen pt-16 pb-16">
      <h1 class="text-5xl font-bold text-purple-600 mb-6">Blind Accessibility</h1>
      <p class="text-center max-w-2xl text-lg leading-relaxed mb-8">
        انطلق في تجربة مميزة مع <strong>Blind Accessibility</strong>، التطبيق الرائد الذي يقدم حلولًا مبتكرة لتعزيز إمكانية الوصول وتحسين الإنتاجية لذوي الاحتياجات الخاصة، خاصة المكفوفين.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
        <button
          onClick={() => window.open('https://blindaccess.pw/المدونة/', '_blank')}
          class="bg-purple-500 text-white py-4 px-6 rounded-lg hover:bg-purple-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المدونة
        </button>
        <button
          onClick={() => navigate('/store')}
          class="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المتجر
        </button>
        <button
          onClick={() => navigate('/forum')}
          class="bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المنتدى
        </button>
      </div>

      <div class="mt-8 text-center">
        <h2 class="text-3xl font-bold text-purple-600 mb-4">انضم إلى فريقنا</h2>
        <p class="text-lg leading-relaxed max-w-2xl mb-4">
          نحن نبحث عن أفراد موهوبين وشغوفين للانضمام إلى فريقنا والمساهمة في تحسين إمكانية الوصول للجميع.
          إذا كنت ترغب في المشاركة والتميز، تواصل معنا الآن!
        </p>
        <button
          onClick={() => window.open('https://blindaccess.pw/انضم-للفريق/', '_blank')}
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