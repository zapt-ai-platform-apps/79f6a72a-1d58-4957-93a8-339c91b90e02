import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from "solid-markdown";

function Assistant(props) {
  const [assistantQuery, setAssistantQuery] = createSignal('');
  const [assistantResponse, setAssistantResponse] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [audioUrl, setAudioUrl] = createSignal('');
  const [playing, setPlaying] = createSignal(false);

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

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
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
          <div class="flex items-center">
            <button
              type="submit"
              class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading()}
            >
              <Show when={!loading()} fallback={"جاري التحميل..."}>
                إرسال
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
              <audio
                src={audioUrl()}
                ref={audioRefElement => audioRef = audioRefElement}
                onEnded={() => setPlaying(false)}
                class="hidden"
              ></audio>
              <button
                onClick={togglePlay}
                class="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
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