import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';

function VoiceAssistant() {
  const navigate = useNavigate();

  const [listening, setListening] = createSignal(false);
  const [transcript, setTranscript] = createSignal('');
  const [assistantResponse, setAssistantResponse] = createSignal('');
  const [loading, setLoading] = createSignal(false);

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
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: inputText,
        response_type: 'text',
      });
      setAssistantResponse(result || 'لم يتم الحصول على رد.');
      handleSpeakResponse(result || 'لم يتم الحصول على رد.');
    } catch (error) {
      console.error('Error:', error);
      setAssistantResponse('حدث خطأ أثناء الحصول على الرد.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakResponse = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم تحويل النص إلى كلام.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-EG';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المساعد الصوتي</h1>

      <button
        onClick={startListening}
        class={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
          listening() ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={listening()}
      >
        <Show when={!listening()} fallback="استمع...">
          اضغط للتحدث
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
        </div>
      </Show>
    </div>
  );
}

export default VoiceAssistant;