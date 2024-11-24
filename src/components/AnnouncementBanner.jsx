import { createSignal, Show, onMount } from 'solid-js';

function AnnouncementBanner() {
  const [showBanner, setShowBanner] = createSignal(true);

  onMount(() => {
    const bannerClosed = localStorage.getItem('bannerClosed');
    if (bannerClosed === 'true') {
      setShowBanner(false);
    }
  });

  const closeBanner = () => {
    setShowBanner(false);
    localStorage.setItem('bannerClosed', 'true');
  };

  return (
    <Show when={showBanner()}>
      <div class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 flex justify-between items-center rounded-lg shadow-md mb-4 animate-pulse">
        <span class="text-lg font-semibold">
          🌟 مرحبًا بك! نحن نعمل جاهدين لإطلاق النسخة الكاملة من التطبيق قريبًا. ترقبوا التحديثات!
        </span>
        <button onClick={closeBanner} class="text-lg font-semibold cursor-pointer focus:outline-none">
          إغلاق
        </button>
      </div>
    </Show>
  );
}

export default AnnouncementBanner;