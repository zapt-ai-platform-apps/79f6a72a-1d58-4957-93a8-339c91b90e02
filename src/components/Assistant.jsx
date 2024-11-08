import { createSignal, onCleanup } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function Assistant() {
  const [userInput, setUserInput] = createSignal('');
  const [messages, setMessages] = createSignal([]);
  const [isListening, setIsListening] = createSignal(false);
  const [isSpeaking, setIsSpeaking] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  let recognition;
  let speechSynthesisUtterance;

  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition(); // eslint-disable-line no-undef
    recognition.lang = 'ar';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      handleSubmit();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
      setIsListening(false);
    };
  }

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
      speechSynthesisUtterance.lang = 'ar';
      speechSynthesis.speak(speechSynthesisUtterance);
      setIsSpeaking(true);

      speechSynthesisUtterance.onend = () => {
        setIsSpeaking(false);
      };
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  onCleanup(() => {
    if (recognition) {
      recognition.stop();
    }
    if (speechSynthesisUtterance) {
      speechSynthesis.cancel();
    }
  });

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!userInput()) return;

    setLoading(true);
    const newMessage = { role: 'user', content: userInput() };
    setMessages([...messages(), newMessage]);
    setUserInput('');

    try {
      const response = await createEvent('chatgpt_request', {
        prompt: userInput(),
        response_type: 'text',
      });

      const botMessage = { role: 'assistant', content: response };
      setMessages([...messages(), botMessage]);

      // Automatically speak the response
      speakText(response);
    } catch (error) {
      console.error('Error communicating with assistant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">المساعد الصوتي</h2>
      <div class="w-full max-w-2xl space-y-4 flex-1 overflow-y-auto mb-4">
        {messages().map((message, index) => (
          <div
            class={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 text-right'
                : 'bg-green-100 text-left'
            }`}
            key={index}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} class="w-full max-w-2xl">
        <div class="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={userInput()}
            onInput={(e) => setUserInput(e.target.value)}
            placeholder="اكتب سؤالك..."
            class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
          <button
            type="submit"
            class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            disabled={loading()}
          >
            {loading() ? 'جارٍ...' : 'إرسال'}
          </button>
        </div>
        <div class="flex items-center space-x-4 justify-center">
          {!isListening() ? (
            <button
              type="button"
              onClick={startListening}
              class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              ابدأ التحدث
            </button>
          ) : (
            <button
              type="button"
              onClick={stopListening}
              class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              إيقاف التحدث
            </button>
          )}
          {!isSpeaking() ? (
            <button
              type="button"
              onClick={() => speakText(messages().length > 0 ? messages()[messages().length - 1].content : '')}
              class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              disabled={messages().length === 0}
            >
              استماع
            </button>
          ) : (
            <button
              type="button"
              onClick={stopSpeaking}
              class="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              إيقاف الاستماع
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Assistant;