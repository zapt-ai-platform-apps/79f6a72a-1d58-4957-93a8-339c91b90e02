import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';

function VoiceAssistant() {
  const navigate = useNavigate();

  const [listening, setListening] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const { NotificationComponent, showNotification } = createNotification();

  let recognition;

  const startListening = () => {
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
      handleAssistantRequest(speechResult);
    };

    recognition.onerror = (event) => {
      console.error('Error during recognition:', event.error);
      setListening(false);
    };

    recognition.start();
  };

  const handleAssistantRequest = async (inputText) => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: inputText,
        response_type: 'text',
      });
      navigate('/voice-assistant-result', {
        state: {
          transcript: inputText,
          assistantResponse: result || 'لم يتم الحصول على رد.',
        },
      });
    } catch (error) {
      console.error('Error:', error);
      showNotification('حدث خطأ أثناء الحصول على الرد.', 'error');
      setLoading(false);
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
    </div>
  );
}

export default VoiceAssistant;