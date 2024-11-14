import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';

function SmartTextEditor() {
  const navigate = useNavigate();
  const [textInput, setTextInput] = createSignal('');
  const [processedText, setProcessedText] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const actions = [
    { name: 'تصحيح النص', prompt: 'صحح النص التالي لغويًا ونحويًا: ' },
    { name: 'تشكيل النص', prompt: 'قم بتشكيل النص التالي: ' },
    { name: 'تحسين النص', prompt: 'حسّن النص التالي: ' },
    { name: 'ترجمة النص', prompt: 'ترجم النص التالي إلى الإنجليزية: ' },
  ];

  const [selectedAction, setSelectedAction] = createSignal(actions[0]);

  const handleProcessText = async () => {
    if (!textInput()) return;
    setIsLoading(true);
    try {
      const prompt = `${selectedAction().prompt}${textInput()}`;
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
        console.error('Error copying content:', err);
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
          value={textInput()}
          onInput={(e) => setTextInput(e.target.value)}
          placeholder="اكتب النص هنا..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="6"
        ></textarea>

        <div class="flex flex-wrap gap-4">
          <For each={actions}>
            {(action) => (
              <button
                onClick={() => {
                  setSelectedAction(action);
                  handleProcessText();
                }}
                class={`flex-1 px-6 py-3 ${selectedAction().name === action.name ? 'bg-purple-500' : 'bg-blue-500'} text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
                disabled={isLoading() || !textInput()}
              >
                {action.name}
              </button>
            )}
          </For>
        </div>

        <Show when={processedText()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <p class="text-gray-700 whitespace-pre-wrap">{processedText()}</p>
          </div>
          <div class="mt-2">
            <button
              onClick={copyText}
              class="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
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