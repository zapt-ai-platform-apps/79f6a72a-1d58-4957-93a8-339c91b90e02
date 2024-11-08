import { createSignal, Show, onCleanup } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from "solid-markdown";
import { useNavigate } from '@solidjs/router';

function Assistant() {
  const [assistantQuery, setAssistantQuery] = createSignal('');
  const [assistantResponse, setAssistantResponse] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [audioUrl, setAudioUrl] = createSignal('');
  const [playing, setPlaying] = createSignal(false);
  const [recording, setRecording] = createSignal(false);
  const [recognition, setRecognition] = createSignal(null);

  const navigate = useNavigate();
  let audioRef;

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

      // تحويل الرد إلى كلام مسموع
      const audioResult = await createEvent('text_to_speech', {
        text: result
      });
      setAudioUrl(audioResult);
    } catch (error) {
      console.error('Error fetching assistant response:', error);
      alert('حدث خطأ أثناء جلب الرد. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioRef) {
      if (!playing()) {
        audioRef.play();
        setPlaying(true);
      } else {
        audioRef.pause();
        setPlaying(false);
      }
    }
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('متصفحك لا يدعم التعرف على الكلام.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.lang = 'ar-SA';
    recog.continuous = false;
    recog.interimResults = false;

    recog.onstart = () => {
      setRecording(true);
    };

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAssistantQuery(transcript);
    };

    recog.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert('حدث خطأ في التعرف على الكلام. يرجى المحاولة مرة أخرى.');
    };

    recog.onend = () => {
      setRecording(false);
    };

    recog.start();
    setRecognition(recog);
  };

  const stopRecording = () => {
    if (recognition()) {
      recognition().stop();
      setRecognition(null);
      setRecording(false);
    }
  };

  onCleanup(() => {
    if (recognition()) {
      recognition().abort();
    }
  });

  return (
    <div class="flex flex-col items-center justify-center min-h-screen p-4 text-gray-800" dir="rtl">
      <div class="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-purple-600">المساعد الصوتي</h2>
          <button
            onClick={() => navigate(-1)}
            class="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out cursor-pointer"
            aria-label="العودة"
          >
            🔙
          </button>
        </div>
        <form onSubmit={handleAssistantQuery} class="space-y-4">
          <textarea
            placeholder="اكتب سؤالك هنا أو استخدم الميكروفون..."
            value={assistantQuery()}
            onInput={(e) => setAssistantQuery(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none box-border text-gray-800"
            rows="4"
          ></textarea>
          <div class="flex items-center justify-between">
            <button
              type="submit"
              class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mr-2 ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading()}
            >
              <Show when={!loading()} fallback={"جاري التحميل..."}>
                إرسال
              </Show>
            </button>
            <button
              type="button"
              onClick={recording() ? stopRecording : startRecording}
              class={`flex-1 px-6 py-3 ${recording() ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ml-2`}
            >
              {recording() ? 'إيقاف التحدث' : 'ابدأ التحدث'}
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
              <audio
                src={audioUrl()}
                ref={el => audioRef = el}
                onEnded={() => setPlaying(false)}
                class="hidden"
              ></audio>
              <button
                onClick={togglePlay}
                class="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                <Show when={!playing()} fallback={"إيقاف الاستماع"}>
                  استماع
                </Show>
                <Show when={playing()}>
                  إيقاف الاستماع
                </Show>
              </button>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default Assistant;