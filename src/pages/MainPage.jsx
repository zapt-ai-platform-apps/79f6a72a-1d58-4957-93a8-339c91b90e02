import { useNavigate } from '@solidjs/router';

function MainPage() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 min-h-screen bg-white text-gray-800 pt-8 pb-16 flex-grow">
      <h1 class="text-5xl font-bold text-primary mb-6">Blind Accessibility</h1>
      <p class="text-center max-w-2xl text-lg leading-relaxed mb-8">
        منصة شاملة تقدم مجموعة متنوعة من الموارد والخدمات لتحسين إمكانية الوصول وتحسين الإنتاجية للأشخاص ذوي الاحتياجات الخاصة، وخاصة المكفوفين.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
        <button
          onClick={() => navigate('/blog')}
          class="bg-primary text-white py-4 px-6 rounded-lg hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المدونة
        </button>
        <button
          onClick={() => navigate('/store')}
          class="bg-secondary text-white py-4 px-6 rounded-lg hover:bg-secondary-dark transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المتجر
        </button>
        <button
          onClick={() => navigate('/forum')}
          class="bg-accent text-white py-4 px-6 rounded-lg hover:bg-accent-dark transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المنتدى
        </button>
      </div>

      <div class="mt-8 text-center">
        <h2 class="text-3xl font-bold text-primary mb-4">انضم إلى فريقنا</h2>
        <p class="text-lg leading-relaxed max-w-2xl mb-4">
          نحن نبحث عن أفراد موهوبين وشغوفين للانضمام إلى فريقنا والمساهمة في تحسين إمكانية الوصول للجميع.
          إذا كنت ترغب في المشاركة والتميز، تواصل معنا الآن!
        </p>
        <button
          onClick={() => navigate('/join-us')}
          class="mt-4 bg-danger text-white py-3 px-6 rounded-lg hover:bg-danger-dark transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          انضم إلينا
        </button>
      </div>

      <div class="mt-8 text-center">
        <h2 class="text-2xl font-bold text-primary mb-4">تابعونا</h2>
        <div class="flex justify-center space-x-4">
          <a href="FACEBOOK_URL" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <img src="https://images.unsplash.com/photo-1611262588024-d12430b98920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw1fHxGYWNlYm9vayUyMGxvZ28lMjBpY29ufGVufDB8fHx8MTczMTYzMjIzMnww&ixlib=rb-4.0.3&q=80&w=1080"  alt="فيسبوك" class="w-10 h-10" data-image-request="Facebook logo icon" />
          </a>
          <a href="YOUTUBE_URL" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <img src="https://images.unsplash.com/photo-1611605698335-8b1569810432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw5fHxZb3VUdWJlJTIwbG9nbyUyMGljb258ZW58MHx8fHwxNzMxNjMyMjMzfDA&ixlib=rb-4.0.3&q=80&w=1080"  alt="يوتيوب" class="w-10 h-10" data-image-request="YouTube logo icon" />
          </a>
          <a href="https://t.me/Blindaccessibilitybot" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <img src="https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw1fHxUZWxlZ3JhbSUyMGxvZ28lMjBpY29ufGVufDB8fHx8MTczMTYzMjIzM3ww&ixlib=rb-4.0.3&q=80&w=1080"  alt="تيليجرام" class="w-10 h-10" data-image-request="Telegram logo icon" />
          </a>
          <a href="https://chat.whatsapp.com/CVW8aHib2SKIXlTroXMxYH" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <img src="https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwxMHx8V2hhdHNBcHAlMjBsb2dvJTIwaWNvbnxlbnwwfHx8fDE3MzE2MzIyMzN8MA&ixlib=rb-4.0.3&q=80&w=1080"  alt="واتساب" class="w-10 h-10" data-image-request="WhatsApp logo icon" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainPage;