import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';
import Loader from '../components/Loader';
import { SolidMarkdown } from 'solid-markdown';

function Assistant() {
  const navigate = useNavigate();

  const [inputText, setInputText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [assistantResponse, setAssistantResponse] = createSignal('');
  const [loadingAudio, setLoadingAudio] = createSignal(false);

  const { NotificationComponent, showNotification } = createNotification();

  const handleAssistantRequest = async () => {
    if (inputText().trim() === '') return;
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: inputText(),
        response_type: 'text',
      });
      setAssistantResponse(result || 'لا يوجد رد.');
    } catch (error) {
      console.error('Error:', error);
      showNotification('حدث خطأ أثناء الحصول على الرد.', 'error');
    } finally {
      setLoading(false);
      setInputText('');
    }
  };

  const handleCopyResponse = () => {
    if (assistantResponse()) {
      navigator.clipboard
        .writeText(assistantResponse())
        .then(() => {
          showNotification('تم نسخ الرد إلى الحافظة', 'success');
        })
        .catch((error) => {
          console.error('فشل النسخ:', error);
          showNotification('فشل نسخ الرد', 'error');
        });
    }
  };

  const handleListenResponse = async () => {
    if (!assistantResponse()) return;
    setLoadingAudio(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: assistantResponse(),
      });
      const audio = new Audio(result);
      audio.play();
    } catch (error) {
      console.error('خطأ في تحويل النص إلى كلام:', error);
      showNotification('حدث خطأ أثناء تشغيل الصوت.', 'error');
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المساعد الذكي</h1>

      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        مرحبًا بك في المساعد الذكي! اطرح سؤالك واحصل على إجابة فورية باستخدام الذكاء الاصطناعي.
      </p>

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
          class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={loading()}
        >
          <Show when={!loading()} fallback={<Loader loading={loading()} />}>
            أرسل
          </Show>
        </button>

        <Show when={assistantResponse()}>
          <div class="mt-6 p-6 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <h2 class="text-2xl font-bold mb-4 text-purple-600">الرد:</h2>
            <SolidMarkdown class="prose prose-lg text-gray-700 mb-4" children={assistantResponse()} />
            <div class="flex space-x-4 justify-center">
              <button
                onClick={handleCopyResponse}
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                نسخ
              </button>
              <button
                onClick={handleListenResponse}
                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={loadingAudio()}
              >
                <Show when={!loadingAudio()} fallback={<Loader loading={loadingAudio()} />}>
                  استماع
                </Show>
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default Assistant;