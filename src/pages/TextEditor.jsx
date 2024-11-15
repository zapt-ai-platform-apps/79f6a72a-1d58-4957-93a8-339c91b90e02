import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';

function TextEditor() {
  const navigate = useNavigate();

  const [inputText, setInputText] = createSignal('');
  const [outputText, setOutputText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [selectedOption, setSelectedOption] = createSignal('');

  const handleOptionClick = async (option) => {
    if (inputText().trim() === '') return;
    setSelectedOption(option);
    setLoading(true);
    let prompt = '';
    switch (option) {
      case 'tashkeel':
        prompt = `الرجاء تشكيل النص التالي: ${inputText()}`;
        break;
      case 'correction':
        prompt = `الرجاء تصحيح الأخطاء الإملائية والنحوية في النص التالي: ${inputText()}`;
        break;
      case 'paraphrase':
        prompt = `الرجاء إعادة صياغة النص التالي بأسلوب مختلف مع الحفاظ على المعنى: ${inputText()}`;
        break;
      default:
        break;
    }
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setOutputText(result || 'لم يتم الحصول على نتيجة.');
    } catch (error) {
      console.error('Error:', error);
      setOutputText('حدث خطأ أثناء معالجة النص.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutput = () => {
    if (outputText()) {
      navigator.clipboard
        .writeText(outputText())
        .then(() => {
          // يمكن إضافة إشعار بنجاح النسخ
        })
        .catch((error) => {
          console.error('فشل النسخ:', error);
          // يمكن إعلام المستخدم بفشل النسخ
        });
    }
  };

  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">محرر النصوص</h1>

      <div class="w-full max-w-md">
        <textarea
          class="w-full h-40 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          placeholder="أدخل النص هنا..."
          value={inputText()}
          onInput={(e) => setInputText(e.target.value)}
        />
        <div class="flex flex-col space-y-2">
          <button
            onClick={() => handleOptionClick('tashkeel')}
            class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading() && selectedOption() === 'tashkeel' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            <Show when={!(loading() && selectedOption() === 'tashkeel')} fallback="جاري التشكيل...">
              تشكيل النص
            </Show>
          </button>
          <button
            onClick={() => handleOptionClick('correction')}
            class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading() && selectedOption() === 'correction' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            <Show when={!(loading() && selectedOption() === 'correction')} fallback="جاري التصحيح...">
              تصحيح النص
            </Show>
          </button>
          <button
            onClick={() => handleOptionClick('paraphrase')}
            class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading() && selectedOption() === 'paraphrase' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            <Show when={!(loading() && selectedOption() === 'paraphrase')} fallback="جاري إعادة الصياغة...">
              إعادة صياغة النص
            </Show>
          </button>
        </div>
      </div>

      <Show when={outputText()}>
        <div class="w-full max-w-md mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2 text-purple-600">النتيجة:</h3>
          <p class="text-gray-700 whitespace-pre-wrap mb-4">{outputText()}</p>
          <button
            onClick={handleCopyOutput}
            class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            نسخ النص
          </button>
        </div>
      </Show>
    </div>
  );
}

export default TextEditor;