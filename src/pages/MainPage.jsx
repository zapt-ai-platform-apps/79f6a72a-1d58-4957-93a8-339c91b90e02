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
        <h2 class="text-2xl font-bold text-primary mb-4">تابعونا على شبكات التواصل الاجتماعي</h2>
        <div class="flex justify-center gap-6">
          {/* فيسبوك */}
          <a href="FACEBOOK_URL" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105">
              <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                {/* أيقونة فيسبوك */}
                <path d="M22.675 0h-21.35C.595 0 0 .594 0 1.326v21.348C0 23.406.595 24 1.326 24H12.82V14.708h-3.417v-3.59h3.417V8.41c0-3.38 2.02-5.226 5.08-5.226 1.47 0 3.003.26 3.003.26v3.31h-1.691c-1.66 0-2.176 1.033-2.176 2.1v2.53h3.708l-.593 3.59h-3.115V24h6.1c.73 0 1.325-.594 1.325-1.326V1.326C24 .594 23.405 0 22.675 0z"/>
              </svg>
            </div>
          </a>
          {/* يوتيوب */}
          <a href="YOUTUBE_URL" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-800 transition duration-300 ease-in-out transform hover:scale-105">
              <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                {/* أيقونة يوتيوب */}
                <path d="M23.498 6.186a2.99 2.99 0 00-2.107-2.115C19.336 3.5 12 3.5 12 3.5s-7.336 0-9.391.571A2.99 2.99 0 00.5 6.186a31.36 31.36 0 00-.5 5.814c0 2.13.166 4.26.5 5.814a2.99 2.99 0 002.11 2.118C4.666 20.5 12 20.5 12 20.5s7.336 0 9.391-.571a2.99 2.99 0 002.107-2.115c.334-1.554.5-3.684.5-5.814s-.166-4.26-.5-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          </a>
          {/* تيليجرام */}
          <a href="https://t.me/Blindaccessibilitybot" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
              <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                {/* أيقونة تيليجرام */}
                <path d="M12 0C5.371 0 0 5.372 0 12c0 6.629 5.371 12 12 12s12-5.371 12-12c0-6.628-5.371-12-12-12zm5.453 8.722L15.338 17c-.129.565-.494.703-1.001.438l-2.774-2.05-1.339 1.287c-.148.146-.272.271-.56.271l.201-2.883 5.251-4.75c.228-.21-.049-.328-.355-.118l-6.483 4.083-2.791-.871c-.607-.189-.62-.607.127-.9l10.888-4.201c.507-.19.946.122.785.899z"/>
              </svg>
            </div>
          </a>
          {/* واتساب */}
          <a href="https://chat.whatsapp.com/CVW8aHib2SKIXlTroXMxYH" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105">
              <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                {/* أيقونة واتساب */}
                <path d="M12 .5C5.659.5.5 5.66.5 12c0 2.074.543 4.034 1.57 5.792L.5 23.5l5.802-1.576A11.437 11.437 0 0012 23.5c6.341 0 11.5-5.159 11.5-11.5S18.341.5 12 .5zm5.657 17.244c-.628 1.75-2.127 2.006-3.42 2.006-1.242 0-2.714-.19-4.44-1.712a16.184 16.184 0 01-2.95-2.917 13.085 13.085 0 01-2.146-4.407c-.156-.493-.285-1.031-.285-1.57 0-1.325.706-2.144 1.333-2.718.285-.253.38-.411.665-.411.152 0 .342.011.545.284.2.27.693.841.752.906.113.129.132.253.06.38-.076.132-.113.213-.214.351-.104.14-.219.247-.329.351-.106.1-.117.169-.046.274.379.602.825 1.186 1.339 1.71.721.727 1.535 1.275 2.35 1.648.152.072.233.059.324-.035.084-.088.349-.385.443-.518.094-.133.198-.113.333-.068a10.4 10.4 0 001.685.342c.167.035.265.054.303.11.037.058.037.213-.009.418-.057.25-.272.841-.805 1.366z"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainPage;