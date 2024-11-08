import { createSignal } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function SmartTextEditor() {
  const [text, setText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [isSpeaking, setIsSpeaking] = createSignal(false);
  const navigate = useNavigate();

  let speechSynthesisUtterance;

  const handleAction = async (actionType) => {
    if (!text()) return;

    setLoading(true);

    try {
      let prompt = '';
      if (actionType === 'correct') {
        prompt = `قم بتصحيح النص التالي نحويًا وإملائيًا دون تغيير المعنى: ${text()}`;
      } else if (actionType === 'vocalize') {
        prompt = `قم بتشكيل النص العربي التالي بالكامل: ${text()}`;
      } else if (actionType === 'enhance') {
        prompt = `قم بتحسين ورفع جودة النص التالي مع الحفاظ على المعنى: ${text()}`;
      }

      const response = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });

      setText(response);
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      speechSynthesisUtterance = new SpeechSynthesisUtterance(text());
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

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">محرر النصوص الذكي</h2>
      <textarea
        value={text()}
        onInput={(e) => setText(e.target.value)}
        placeholder="اكتب النص هنا..."
        class="w-full max-w-2xl h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border mb-4"
      ></textarea>
      <div class="flex flex-wrap gap-4 justify-center mb-4">
        <button
          onClick={() => handleAction('correct')}
          class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          disabled={loading()}
        >
          {loading() ? 'جارٍ...' : 'تصحيح النص'}
        </button>
        <button
          onClick={() => handleAction('vocalize')}
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          disabled={loading()}
        >
          {loading() ? 'جارٍ...' : 'تشكيل النص'}
        </button>
        <button
          onClick={() => handleAction('enhance')}
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          disabled={loading()}
        >
          {loading() ? 'جارٍ...' : 'تحسين النص'}
        </button>
      </div>
      <div class="flex items-center space-x-4 justify-center">
        {!isSpeaking() ? (
          <button
            onClick={speakText}
            class="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            disabled={!text()}
          >
            تحويل النص إلى كلام
          </button>
        ) : (
          <button
            onClick={stopSpeaking}
            class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إيقاف الاستماع
          </button>
        )}
      </div>
    </div>
  );
}

export default SmartTextEditor;