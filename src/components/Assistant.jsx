import { createSignal, onMount, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';
import { state, setState } from '../store';

function Assistant() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = createSignal('');
  const [isListening, setIsListening] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  let recognition;

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
        setError('حدث خطأ أثناء التعرف على الصوت.');
      };
    } else {
      setError('متصفحك لا يدعم التعرف على الصوت.');
    }
  });

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
      setError('');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleSend = async () => {
    if (!userInput()) return;
    setIsLoading(true);
    setError('');

    let conversation = [...(state.assistantConversation || [])];
    conversation.push({ role: 'user', content: userInput() });

    try {
      const response = await createEvent('chatgpt_request', {
        prompt: userInput(),
        response_type: 'text',
      });

      conversation.push({ role: 'assistant', content: response });

      setState('assistantConversation', conversation);

      setUserInput('');

      navigate('/assistant-conversation');

    } catch (error) {
      console.error('Error in Assistant:', error);
      setError('حدث خطأ أثناء معالجة طلبك.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pb-16">
      <button
        onClick={() => navigate('/tools')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">المساعد الصوتي بالذكاء الاصطناعي</h2>

      <Show when={error()}>
        <div class="text-red-500 mb-4">{error()}</div>
      </Show>

      <div class="w-full max-w-2xl space-y-4">
        <div class="flex">
          <input
            type="text"
            value={userInput()}
            onInput={(e) => setUserInput(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            class="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            disabled={isLoading()}
          />
          <button
            onClick={handleSend}
            class={`px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${(isLoading() || !userInput()) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading() || !userInput()}
          >
            {isLoading() ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </div>
        <div class="flex gap-4">
          <button
            onClick={isListening() ? stopListening : startListening}
            class={`flex-1 px-6 py-3 ${isListening() ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
            disabled={isLoading()}
          >
            {isListening() ? 'إيقاف التحدث' : 'ابدأ التحدث'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Assistant;