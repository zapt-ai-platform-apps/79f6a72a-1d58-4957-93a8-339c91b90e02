import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { state } from '../store';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from 'solid-markdown';

function ProcessedText() {
  const [loading, setLoading] = createSignal(true);
  const navigate = useNavigate();

  onMount(async () => {
    try {
      let prompt = '';
      switch (state.selectedOption) {
        case 'تصحيح الأخطاء الإملائية':
          prompt = `صحح الأخطاء الإملائية في النص التالي باللغة العربية:\n${state.userText}`;
          break;
        case 'إعادة الصياغة':
          prompt = `أعد صياغة النص التالي باللغة العربية:\n${state.userText}`;
          break;
        case 'تحويل إلى لهجة مختلفة':
          prompt = `حول النص التالي إلى اللهجة المصرية:\n${state.userText}`;
          break;
        default:
          prompt = state.userText;
      }
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setState('processedText', result);
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setLoading(false);
    }
  });

  const copyText = () => {
    navigator.clipboard.writeText(state.processedText)
      .then(() => {
        alert('تم نسخ النص إلى الحافظة');
      })
      .catch(err => {
        console.error('Error copying text:', err);
      });
  };

  const listenText = async () => {
    try {
      const audioUrl = await createEvent('text_to_speech', {
        text: state.processedText,
      });
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  const regenerateText = async () => {
    setLoading(true);
    try {
      let prompt = '';
      switch (state.selectedOption) {
        case 'تصحيح الأخطاء الإملائية':
          prompt = `صحح الأخطاء الإملائية في النص التالي باللغة العربية:\n${state.userText}`;
          break;
        case 'إعادة الصياغة':
          prompt = `أعد صياغة النص التالي باللغة العربية:\n${state.userText}`;
          break;
        case 'تحويل إلى لهجة مختلفة':
          prompt = `حول النص التالي إلى لهجة شامية:\n${state.userText}`;
          break;
        default:
          prompt = state.userText;
      }
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setState('processedText', result);
    } catch (error) {
      console.error('Error regenerating text:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pb-16">
      <button
        onClick={() => navigate('/editor')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      {loading() ? (
        <p>جاري معالجة النص...</p>
      ) : (
        <>
          <h2 class="text-3xl font-bold text-purple-600 mb-6">النص المعالج</h2>
          <div class="prose prose-lg text-gray-700 bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
            <SolidMarkdown children={state.processedText} />
          </div>
          <div class="flex gap-4 mt-4">
            <button
              onClick={copyText}
              class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              نسخ النص
            </button>
            <button
              onClick={listenText}
              class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              استماع
            </button>
            <button
              onClick={regenerateText}
              class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              إعادة إنشاء
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProcessedText;