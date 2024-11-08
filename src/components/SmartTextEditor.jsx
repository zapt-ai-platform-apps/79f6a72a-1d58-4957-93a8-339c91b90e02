import { createSignal, onMount, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';

function SmartTextEditor(props) {
  const [editorText, setEditorText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [listening, setListening] = createSignal(false);
  const [audioUrl, setAudioUrl] = createSignal('');
  const [playing, setPlaying] = createSignal(false);

  let recognition;
  let audioRef;

  onMount(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setEditorText(editorText() + ' ' + transcript);
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

  const improveText = async () => {
    if (!editorText()) return;
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `قم بتحسين النص التالي مع الحفاظ على معناه:\n\n${editorText()}`,
        response_type: 'text'
      });
      setEditorText(result);
    } catch (error) {
      console.error('Error improving text:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAudio = async () => {
    if (!editorText()) return;
    setLoading(true);
    try {
      const audioResult = await createEvent('text_to_speech', {
        text: editorText()
      });
      setAudioUrl(audioResult);
    } catch (error) {
      console.error('Error generating audio:', error);
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
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-purple-600">أداة محرر النصوص الذكي</h2>
          <button
            onClick={props.onClose}
            class="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out cursor-pointer"
            aria-label="إغلاق"
          >
            ✖️
          </button>
        </div>
        <div class="space-y-4">
          <textarea
            placeholder="اكتب نصك هنا..."
            value={editorText()}
            onInput={(e) => setEditorText(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none box-border"
            rows="6"
          ></textarea>
          <div class="flex space-x-4">
            <button
              type="button"
              onClick={improveText}
              class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading()}
            >
              <Show when={!loading()} fallback={"جاري التحميل..."}>
                تحسين النص
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
          <button
            type="button"
            onClick={generateAudio}
            class={`w-full mt-4 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading()}
          >
            <Show when={!loading()} fallback={"جاري التحميل..."}>
              تحويل النص إلى كلام
            </Show>
          </button>
          <Show when={audioUrl()}>
            <audio
              src={audioUrl()}
              ref={audioRefElement => audioRef = audioRefElement}
              onEnded={() => setPlaying(false)}
              class="hidden"
            ></audio>
            <button
              onClick={togglePlay}
              class="w-full mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
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
      </div>
    </div>
  );
}

export default SmartTextEditor;