import { useNavigate } from '@solidjs/router';

function MainPage() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-4">tools</h1>
      <p class="text-center max-w-2xl text-lg leading-relaxed mb-8">
        تطبيق شامل يقدم مجموعة متنوعة من الأدوات الذكية لزيادة إمكانية الوصول وتحسين الإنتاجية للأشخاص ذوي الاحتياجات الخاصة، وخاصة المكفوفين.
      </p>

      {/* New buttons section */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
        <button
          onClick={() => navigate('/blog')}
          class="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المدونة
        </button>
        <button
          onClick={() => navigate('/store')}
          class="bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المتجر
        </button>
        <button
          onClick={() => navigate('/forum')}
          class="bg-purple-500 text-white py-4 px-6 rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المنتدى
        </button>
      </div>

      {/* تابعونا section */}
      <div class="mt-8">
        <h2 class="text-2xl font-bold text-purple-600 mb-4">تابعونا</h2>
        <div class="flex justify-center space-x-4">
          <a href="FACEBOOK_URL" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <img src="https://images.unsplash.com/photo-1611944212129-29977ae1398c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwyfHxGYWNlYm9vayUyMGxvZ28lMjBpY29ufGVufDB8fHx8MTczMTYzMjIzMnww&ixlib=rb-4.0.3&q=80&w=1080"  alt="فيسبوك" class="w-10 h-10" data-image-request="Facebook logo icon" />
          </a>
          <a href="YOUTUBE_URL" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <img src="https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwxfHxZb3VUdWJlJTIwbG9nbyUyMGljb258ZW58MHx8fHwxNzMxNjMyMjMzfDA&ixlib=rb-4.0.3&q=80&w=1080"  alt="يوتيوب" class="w-10 h-10" data-image-request="YouTube logo icon" />
          </a>
          <a href="TELEGRAM_URL" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <img src="https://images.unsplash.com/photo-1622964318124-d87cb88d24e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwxMHx8VGVsZWdyYW0lMjBsb2dvJTIwaWNvbnxlbnwwfHx8fDE3MzE2MzIyMzN8MA&ixlib=rb-4.0.3&q=80&w=1080"  alt="تيليجرام" class="w-10 h-10" data-image-request="Telegram logo icon" />
          </a>
          <a href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <img src="https://images.unsplash.com/photo-1612810806546-ebbf22b53496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwzfHxXaGF0c0FwcCUyMGxvZ28lMjBpY29ufGVufDB8fHx8MTczMTYzMjIzM3ww&ixlib=rb-4.0.3&q=80&w=1080"  alt="واتساب" class="w-10 h-10" data-image-request="WhatsApp logo icon" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainPage;