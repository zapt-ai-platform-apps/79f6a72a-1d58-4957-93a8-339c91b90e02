import { useNavigate, useLocation } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { createNotification } from '../components/Notification';
import { SolidMarkdown } from 'solid-markdown';
import BackButton from '../components/BackButton';

function ContentResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [generatedContent] = createSignal(location.state?.generatedContent || '');
  const { NotificationComponent, showNotification } = createNotification();

  if (!location.state?.generatedContent) {
    navigate('/content-generator');
  }

  const handleCopyContent = () => {
    if (generatedContent()) {
      navigator.clipboard
        .writeText(generatedContent())
        .then(() => {
          showNotification('تم نسخ المحتوى إلى الحافظة', 'success');
        })
        .catch((error) => {
          console.error('فشل النسخ:', error);
          showNotification('فشل نسخ المحتوى', 'error');
        });
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <BackButton />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المحتوى المولد</h1>
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
        <SolidMarkdown class="prose prose-lg text-gray-700 mb-4" children={generatedContent()} />
        <button
          onClick={handleCopyContent}
          class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          نسخ المحتوى
        </button>
      </div>
    </div>
  );
}

export default ContentResult;