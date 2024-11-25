import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';
import SocialMediaLinks from '../components/SocialMediaLinks';
import AnnouncementBanner from '../components/AnnouncementBanner';

function MainPage() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = createSignal('');

  const handleSelectionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (value === 'home') {
      navigate('/');
    } else if (value === 'blog') {
      navigate('/blog');
    } else if (value === 'store') {
      navigate('/store');
    }
  };

  return (
    <div class="flex flex-col items-center p-4 min-h-screen pt-16 pb-16 text-gray-800">
      <AnnouncementBanner />

      {/* Description of the App */}
      <div class="w-full max-w-2xl mb-6 text-center">
        <p class="text-lg leading-relaxed">
          تطبيق <span class="font-bold">Blind Accessibility</span> هو منصة شاملة توفر مجموعة متنوعة من الأدوات والخدمات المصممة خصيصًا لتعزيز إمكانية الوصول للأشخاص ذوي الإعاقة البصرية. يهدف التطبيق إلى تسهيل الحياة اليومية للمكفوفين وضعاف البصر من خلال تقديم حلول مبتكرة تعتمد على تقنيات الذكاء الاصطناعي.
        </p>
      </div>

      {/* Selection Menu */}
      <div class="w-full max-w-md mb-6">
        <label class="block mb-2 text-lg font-semibold">اختر وجهتك:</label>
        <select
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer box-border"
          value={selectedOption()}
          onInput={handleSelectionChange}
        >
          <option value="">-- اختر من القائمة --</option>
          <option value="home">الرئيسية</option>
          <option value="blog">المدونة</option>
          <option value="store">المتجر</option>
        </select>
      </div>

      <SocialMediaLinks />
    </div>
  );
}

export default MainPage;