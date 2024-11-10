import { createSignal, onMount, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from 'solid-markdown';

function Assistant() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = createSignal('');
  const [assistantResponse, setAssistantResponse] = createSignal('');
  const [isListening, setIsListening] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  let recognition;

  // Initialize speech recognition
  onMount(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'ar-EG';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        stopListening();
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
      };
    } else {
      alert('متصفحك لا يدعم التعرف على الصوت.');
    }
  });

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = async () => {
    if (!userInput()) return;
    setIsLoading(true);
    try {
      const response = await createEvent('chatgpt_request', {
        prompt: userInput(),
        response_type: 'text',
      });
      setAssistantResponse(response);
    } catch (error) {
      console.error('Error fetching assistant response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(assistantResponse())
      .then(() => {
        alert('تم نسخ النص إلى الحافظة');
      })
      .catch(err => {
        console.error('Error copying text:', err);
      });
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">المساعد الصوتي بالذكاء الاصطناعي</h2>

      <div class="w-full max-w-2xl space-y-4">
        <textarea
          value={userInput()}
          onInput={(e) => setUserInput(e.target.value)}
          placeholder="اكتب سؤالك هنا..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="4"
        ></textarea>

        <div class="flex flex-wrap gap-4">
          <button
            onClick={handleSubmit}
            class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading() || !userInput()}
          >
            {isLoading() ? 'جاري التحميل...' : 'إرسال'}
          </button>
          <button
            onClick={isListening() ? stopListening : startListening}
            class={`flex-1 px-6 py-3 ${isListening() ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
            disabled={isLoading()}
          >
            {isListening() ? 'إيقاف التحدث' : 'ابدأ التحدث'}
          </button>
        </div>

        <Show when={assistantResponse()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <SolidMarkdown
              children={assistantResponse()}
              class="prose prose-lg"
            />
          </div>
          <div class="mt-2 flex flex-wrap gap-4">
            <button
              onClick={copyText}
              class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              نسخ النص
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default Assistant;