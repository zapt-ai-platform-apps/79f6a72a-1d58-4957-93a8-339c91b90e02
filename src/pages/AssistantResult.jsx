import { useNavigate, useLocation } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';
import Loader from '../components/Loader';
import { SolidMarkdown } from 'solid-markdown';

function AssistantResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [assistantResponse] = createSignal(location.state?.assistantResponse || '');
  const [loadingAudio, setLoadingAudio] = createSignal(false);
  const { NotificationComponent, showNotification } = createNotification();

  if (!location.state?.assistantResponse) {
    navigate('/assistant');
  }

  const handleCopyResponse = () => {
    if (assistantResponse()) {
      navigator.clipboard
        .writeText(assistantResponse())
        .then(() => {
          showNotification('تم نسخ الرد إلى الحافظة', 'success');
        })
        .catch((error) => {
          console.error('فشل النسخ:', error);
          showNotification('فشل نسخ الرد', 'error');
        });
    }
  };

  const handleListenResponse = async () => {
    if (!assistantResponse()) return;
    setLoadingAudio(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: assistantResponse(),
      });
      const audio = new Audio(result);
      audio.play();
    } catch (error) {
      console.error('خطأ في تحويل النص إلى كلام:', error);
      showNotification('حدث خطأ أثناء تشغيل الصوت.', 'error');
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate('/assistant')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">رد المساعد الذكي</h1>

      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
        <SolidMarkdown class="prose prose-lg text-gray-700 mb-4" children={assistantResponse()} />
        <div class="flex space-x-4 justify-center">
          <button
            onClick={handleCopyResponse}
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            نسخ
          </button>
          <button
            onClick={handleListenResponse}
            class={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 ${
              loadingAudio() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={loadingAudio()}
          >
            <Show when={!loadingAudio()} fallback={<Loader loading={loadingAudio()} />}>
              استماع
            </Show>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssistantResult;