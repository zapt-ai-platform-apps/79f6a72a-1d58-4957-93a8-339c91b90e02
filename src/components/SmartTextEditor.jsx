import { createSignal, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from 'solid-markdown';

function SmartTextEditor() {
  const navigate = useNavigate();
  const [userText, setUserText] = createSignal('');
  const [processedText, setProcessedText] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const [selectedOption, setSelectedOption] = createSignal('');

  const options = [
    { label: 'تصحيح النص', prompt: 'قم بتصحيح النص التالي نحوياً وإملائياً دون تغيير معناه: ' },
    { label: 'تشكيل النص', prompt: 'قم بتشكيل النص التالي بالحركات: ' },
    { label: 'تحسين النص', prompt: 'قم بتحسين صياغة النص التالي وجعله أكثر احترافية: ' },
    { label: 'ترجمة النص', prompt: 'قم بترجمة النص التالي إلى الإنجليزية: ' },
  ];

  const handleProcessText = async () => {
    if (!userText() || !selectedOption()) return;
    setIsLoading(true);
    try {
      const option = options.find(o => o.label === selectedOption());
      const prompt = option.prompt + userText();
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

  const copyText = () => {
    navigator.clipboard.writeText(processedText())
      .then(() => {
        alert('تم نسخ النص إلى الحافظة');
      })
      .catch(err => {
        console.error('Error copying text:', err);
      });
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

      <div class="w-full max-w-2xl space-y-4">
        <textarea
          value={userText()}
          onInput={(e) => setUserText(e.target.value)}
          placeholder="اكتب النص هنا..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="6"
        ></textarea>

        <label for="option-select" class="block text-gray-700">
          اختر العملية:
        </label>
        <select
          id="option-select"
          value={selectedOption()}
          onInput={(e) => setSelectedOption(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
        >
          <option value="">اختر العملية</option>
          <For each={options}>
            {(option) => (
              <option value={option.label}>{option.label}</option>
            )}
          </For>
        </select>

        <button
          onClick={handleProcessText}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() || !userText() || !selectedOption() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading() || !userText() || !selectedOption()}
        >
          {isLoading() ? 'جاري المعالجة...' : 'تنفيذ'}
        </button>

        <Show when={processedText()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <SolidMarkdown class="prose prose-lg text-gray-700" children={processedText()} />
            <button
              onClick={copyText}
              class="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              نسخ النص
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default SmartTextEditor;