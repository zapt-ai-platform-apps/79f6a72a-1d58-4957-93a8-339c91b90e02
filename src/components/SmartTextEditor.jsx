import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';

function SmartTextEditor() {
  const navigate = useNavigate();
  const [text, setText] = createSignal('');
  const [processedText, setProcessedText] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [isSpeaking, setIsSpeaking] = createSignal(false);
  let audio;

  const handleProcessText = async (action) => {
    if (!text()) return;
    setIsLoading(true);
    try {
      let prompt = '';
      switch (action) {
        case 'correct':
          prompt = 'صحح النص التالي: ' + text();
          break;
        case 'tashkeel':
          prompt = 'قم بتشكيل النص التالي: ' + text();
          break;
        case 'improve':
          prompt = 'حسّن النص التالي: ' + text();
          break;
        default:
          break;
      }
      const response = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setProcessedText(response);
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSpeaking = async () => {
    if (processedText()) {
      setIsSpeaking(true);
      try {
        const audioUrl = await createEvent('text_to_speech', {
          text: processedText(),
        });
        audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => {
          setIsSpeaking(false);
        };
      } catch (error) {
        console.error('Error with text to speech:', error);
        setIsSpeaking(false);
      }
    }
  };

  const stopSpeaking = () => {
    if (audio) {
      audio.pause();
      setIsSpeaking(false);
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
      <h2 class="text-3xl font-bold text-purple-600 mb-6">محرر النصوص الذكي</h2>

      <div class="w-full max-w-3xl space-y-4">
        <textarea
          value={text()}
          onInput={(e) => setText(e.target.value)}
          placeholder="أدخل النص هنا..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="6"
        ></textarea>

        <div class="flex flex-wrap gap-4">
          <button
            onClick={() => handleProcessText('correct')}
            class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading()}
          >
            تصحيح النص
          </button>
          <button
            onClick={() => handleProcessText('tashkeel')}
            class={`flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading()}
          >
            تشكيل النص
          </button>
          <button
            onClick={() => handleProcessText('improve')}
            class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading()}
          >
            تحسين النص
          </button>
        </div>

        <Show when={processedText()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <p class="text-gray-700 whitespace-pre-wrap">{processedText()}</p>
          </div>
          <div class="mt-2 flex flex-wrap gap-4">
            <button
              onClick={startSpeaking}
              class={`flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isSpeaking() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSpeaking()}
            >
              {isSpeaking() ? 'جاري الاستماع...' : 'تحويل النص إلى كلام'}
            </button>
            <Show when={isSpeaking()}>
              <button
                onClick={stopSpeaking}
                class="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                إيقاف الاستماع
              </button>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default SmartTextEditor;