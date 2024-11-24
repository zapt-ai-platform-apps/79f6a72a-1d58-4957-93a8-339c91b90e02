import { useNavigate } from '@solidjs/router';
import SocialMediaLinks from '../components/SocialMediaLinks';
import AnnouncementBanner from '../components/AnnouncementBanner';

function MainPage() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 h-full pt-16 pb-16">
      <AnnouncementBanner />
      <h1 class="text-5xl font-bold text-purple-600 mb-6">Blind Accessibility</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">نمكن الجميع من الوصول إلى عالم الرقميات</h2>
      <p class="text-center max-w-2xl text-lg leading-relaxed mb-8 text-gray-800">
        نسعى لتقديم أدوات وخدمات ذكية تزيد من إنتاجيتك وتعزز إمكانية الوصول لديك. ابدأ الآن رحلتك نحو تجربة رقمية لا مثيل لها!
      </p>

      <div class="grid grid-cols-1 gap-4 w-full max-w-md mt-6">
        {/* Content removed as per request */}
      </div>

      <SocialMediaLinks />
    </div>
  );
}

export default MainPage;