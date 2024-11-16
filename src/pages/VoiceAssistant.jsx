import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';

function VoiceAssistant() {
  const navigate = useNavigate();

  const [listening, setListening] = createSignal(false);
  const [transcript, setTranscript] = createSignal('');
  const [assistantResponse, setAssistantResponse] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [loadingAudio, setLoadingAudio] = createSignal(false);

  const { NotificationComponent, showNotification } = createNotification();

  let recognition;
  let currentAudio = null; // متغير لتخزين الكائن الصوتي الحالي

  const startListening = () => {
    // إيقاف أي تشغيل صوتي سابق
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('متصفحك لا يدعم التعرف على الصوت.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      handleAssistantRequest(speechResult);
    };

    recognition.onerror = (event) => {
      console.error('Error during recognition:', event.error);
      setListening(false);
    };

    recognition.start();
  };

  const handleAssistantRequest = async (inputText) => {
    // إيقاف أي تشغيل صوتي سابق
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: inputText,
        response_type: 'text',
      });
      setAssistantResponse(result || 'لم يتم الحصول على رد.');
      await handleSpeakResponse(result || 'لم يتم الحصول على رد.');
    } catch (error) {
      console.error('Error:', error);
      setAssistantResponse('حدث خطأ أثناء الحصول على الرد.');
      showNotification('حدث خطأ أثناء الحصول على الرد.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakResponse = async (text) => {
    // إيقاف أي تشغيل صوتي سابق
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    setLoadingAudio(true);
    try {
      const audioUrl = await createEvent('text_to_speech', {
        text: text,
      });
      // تشغيل الصوت الجديد
      currentAudio = new Audio(audioUrl);
      currentAudio.play();
    } catch (error) {
      console.error('خطأ في تحويل النص إلى كلام:', error);
      // في حالة الخطأ، يمكن استخدام تحويل النص إلى كلام في المتصفح
      if ('speechSynthesis' in window) {
        // إيقاف أي كلام جارٍ
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-EG';
        window.speechSynthesis.speak(utterance);
      } else {
        alert('متصفحك لا يدعم تحويل النص إلى كلام.');
      }
    } finally {
      setLoadingAudio(false);
    }
  };

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

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المساعد الصوتي</h1>

      <button
        onClick={startListening}
        class={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
          listening() || loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        disabled={listening() || loading()}
      >
        <Show when={!listening()} fallback="استمع...">
          <Show when={!loading()} fallback="جاري المعالجة...">
            اضغط للتحدث
          </Show>
        </Show>
      </button>

      <Show when={transcript()}>
        <div class="w-full max-w-md mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2 text-purple-600">نصك:</h3>
          <p class="text-gray-700 whitespace-pre-wrap mb-4">{transcript()}</p>
        </div>
      </Show>

      <Show when={assistantResponse()}>
        <div class="w-full max-w-md mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2 text-purple-600">رد المساعد:</h3>
          <p class="text-gray-700 whitespace-pre-wrap mb-4">{assistantResponse()}</p>
          <button
            onClick={handleCopyResponse}
            class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            نسخ
          </button>
        </div>
      </Show>
    </div>
  );
}

export default VoiceAssistant;