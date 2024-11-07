import { createSignal, onMount, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from "solid-markdown";

function Assistant(props) {
  const [assistantQuery, setAssistantQuery] = createSignal('');
  const [assistantResponse, setAssistantResponse] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [audioUrl, setAudioUrl] = createSignal('');
  const [listening, setListening] = createSignal(false);

  let recognition;

  onMount(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAssistantQuery(transcript);
      };

      recognition.onend = () => {
        setListening(false);
      };
    } else {
      console.warn('متصفحك لا يدعم التعرف على الكلام.');
    }
  });

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  const handleAssistantQuery = async (e) => {
    e.preventDefault();
    if (!assistantQuery()) return;
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: assistantQuery(),
        response_type: 'text'
      });
      setAssistantResponse(result);

      // Convert response to speech
      const audioResult = await createEvent('text_to_speech', {
        text: result
      });
      setAudioUrl(audioResult);
    } catch (error) {
      console.error('Error fetching assistant response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md mt-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-purple-600">المساعد الذكي</h2>
        <button
          onClick={props.onClose}
          class="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out cursor-pointer"
          aria-label="إغلاق"
        >
          ✖️
        </button>
      </div>
      <form onSubmit={handleAssistantQuery} class="space-y-4">
        <textarea
          placeholder="اكتب سؤالك هنا..."
          value={assistantQuery()}
          onInput={(e) => setAssistantQuery(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none box-border"
          rows="4"
        ></textarea>
        <div class="flex items-center space-x-4">
          <button
            type="submit"
            class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading()}
          >
            <Show when={!loading()} fallback={"جاري التحميل..."}>
              إرسال
            </Show>
          </button>
          <button
            type="button"
            onClick={() => (listening() ? stopListening() : startListening())}
            class="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            aria-label={listening() ? "إيقاف التسجيل" : "بدء التسجيل"}
          >
            <Show when={!listening()}>
              🎤
            </Show>
            <Show when={listening()}>
              ⏹
            </Show>
          </button>
        </div>
      </form>
      <Show when={assistantResponse()}>
        <div class="mt-6">
          <h3 class="text-xl font-bold mb-2 text-purple-600">الرد:</h3>
          <div class="text-gray-700">
            <SolidMarkdown children={assistantResponse()} />
          </div>
          <Show when={audioUrl()}>
            <audio controls src={audioUrl()} class="w-full mt-4"></audio>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default Assistant;