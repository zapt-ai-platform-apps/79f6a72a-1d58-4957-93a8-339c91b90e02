import { useNavigate } from '@solidjs/router';
import { state, setState } from '../store';
import { SolidMarkdown } from 'solid-markdown';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';

function ProcessedText() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = createSignal(false);
  const [audioUrl, setAudioUrl] = createSignal('');

  const copyText = () => {
    navigator.clipboard.writeText(state.processedText)
      .then(() => {
        alert('تم نسخ النص إلى الحافظة');
      })
      .catch(err => {
        console.error('Error copying text:', err);
      });
  };

  const handleListen = async () => {
    setIsLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: state.processedText,
      });
      setAudioUrl(result);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecreate = async () => {
    if (!state.userText || !state.selectedOption) return;
    setIsLoading(true);
    try {
      const options = {
        'تصحيح النص': 'قم بتصحيح النص التالي نحوياً وإملائياً دون تغيير معناه: ',
        'تشكيل النص': 'قم بتشكيل النص التالي بالحركات: ',
        'تحسين النص': 'قم بتحسين صياغة النص التالي وجعله أكثر احترافية: ',
        'ترجمة النص': 'قم بترجمة النص التالي إلى الإنجليزية: ',
      };
      const prompt = options[state.selectedOption] + state.userText;
      const response = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setState('processedText', response);
      setAudioUrl('');
    } catch (error) {
      console.error('Error reprocessing text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <button
        onClick={() => navigate('/editor')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>

      <h2 class="text-3xl font-bold text-purple-600 mb-6">النص المعالج</h2>

      <div class="w-full max-w-2xl space-y-4">
        <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
          <SolidMarkdown class="prose prose-lg text-gray-700" children={state.processedText} />
        </div>
        <div class="mt-2 flex flex-wrap gap-4">
          <button
            onClick={copyText}
            class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            نسخ النص
          </button>
          <button
            onClick={handleListen}
            class={`flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading()}
          >
            {isLoading() ? 'جاري التحميل...' : 'استماع'}
          </button>
          <button
            onClick={handleRecreate}
            class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading()}
          >
            {isLoading() ? 'جاري التحميل...' : 'إعادة الإنشاء'}
          </button>
        </div>
        <Show when={audioUrl()}>
          <div class="mt-4">
            <audio controls src={audioUrl()} class="w-full" />
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ProcessedText;