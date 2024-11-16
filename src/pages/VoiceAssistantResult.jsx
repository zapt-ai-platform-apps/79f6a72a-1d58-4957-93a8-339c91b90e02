import { useNavigate, useLocation } from '@solidjs/router';
import { createSignal, Show, onCleanup } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';

function VoiceAssistantResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [transcript] = createSignal(location.state?.transcript || '');
  const [assistantResponse] = createSignal(location.state?.assistantResponse || '');
  const [loadingAudio, setLoadingAudio] = createSignal(false);
  const { NotificationComponent, showNotification } = createNotification();
  let currentAudio = null;

  if (!location.state?.assistantResponse) {
    navigate('/voice-assistant');
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

  const handleSpeakResponse = async () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    setLoadingAudio(true);
    try {
      const audioUrl = await createEvent('text_to_speech', {
        text: assistantResponse(),
      });
      currentAudio = new Audio(audioUrl);
      currentAudio.play();
    } catch (error) {
      console.error('خطأ في تحويل النص إلى كلام:', error);
      showNotification('حدث خطأ أثناء تشغيل الصوت.', 'error');
    } finally {
      setLoadingAudio(false);
    }
  };

  // Automatically play the audio
  handleSpeakResponse();

  onCleanup(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
  });

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate('/voice-assistant')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">رد المساعد الصوتي</h1>

      <Show when={transcript()}>
        <div class="w-full max-w-md mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2 text-purple-600">نصك:</h3>
          <p class="text-gray-700 whitespace-pre-wrap mb-4">{transcript()}</p>
        </div>
      </Show>

      <div class="w-full max-w-md mt-6 p-4 bg-white rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-2 text-purple-600">رد المساعد:</h3>
        <p class="text-gray-700 whitespace-pre-wrap mb-4">{assistantResponse()}</p>
        <button
          onClick={handleCopyResponse}
          class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          نسخ
        </button>
        <button
          onClick={handleSpeakResponse}
          class={`w-full mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 ${
            loadingAudio() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          disabled={loadingAudio()}
        >
          <Show when={!loadingAudio()} fallback="جاري التحميل...">
            استماع
          </Show>
        </button>
      </div>
    </div>
  );
}

export default VoiceAssistantResult;