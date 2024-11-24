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
    <div class="flex flex-col items-center p-4 h-full pt-16 pb-16 text-gray-800">
      <AnnouncementBanner />
      <h1 class="text-5xl font-bold text-purple-600 mb-6">Blind Accessibility</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">نمكن الجميع من الوصول إلى عالم الرقميات</h2>

      {/* Selection Menu */}
      <div class="w-full max-w-md mb-6">
        <label class="block mb-2 text-lg font-semibold">اختر وجهتك:</label>
        <select
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
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