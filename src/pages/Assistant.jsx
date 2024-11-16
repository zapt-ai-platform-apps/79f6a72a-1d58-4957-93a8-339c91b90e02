import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';
import Loader from '../components/Loader';

function Assistant() {
  const navigate = useNavigate();

  const [inputText, setInputText] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const { NotificationComponent, showNotification } = createNotification();

  const handleAssistantRequest = async () => {
    if (inputText().trim() === '') return;
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: inputText(),
        response_type: 'text',
      });
      navigate('/assistant-result', { state: { assistantResponse: result || 'لا يوجد رد.' } });
    } catch (error) {
      console.error('Error:', error);
      showNotification('حدث خطأ أثناء الحصول على الرد.', 'error');
    } finally {
      setLoading(false);
      setInputText('');
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المساعد الذكي</h1>

      <div class="w-full max-w-md">
        <textarea
          class="w-full h-32 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          placeholder="أدخل سؤالك هنا..."
          value={inputText()}
          onInput={(e) => setInputText(e.target.value)}
          disabled={loading()}
        />
        <button
          onClick={handleAssistantRequest}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
            loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback={<Loader loading={loading()} />}>
            أرسل
          </Show>
        </button>
      </div>
    </div>
  );
}

export default Assistant;