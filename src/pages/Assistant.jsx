import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';

function Assistant() {
  const navigate = useNavigate();

  const [inputText, setInputText] = createSignal('');
  const [assistantResponse, setAssistantResponse] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [loadingAudio, setLoadingAudio] = createSignal(false);

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
      setAssistantResponse('حدث خطأ أثناء الحصول على الرد.');
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
          // يمكن إضافة إشعار بنجاح النسخ
        })
        .catch((error) => {
          console.error('فشل النسخ:', error);
          // يمكن إعلام المستخدم بفشل النسخ
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
      // تشغيل الصوت دون عرض عناصر التحكم
      const audio = new Audio(result);
      audio.play();
    } catch (error) {
      console.error('خطأ في تحويل النص إلى كلام:', error);
      // يمكن إعلام المستخدم بالخطأ
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
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
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback="جاري المعالجة...">
            أرسل
          </Show>
        </button>
      </div>

      <Show when={assistantResponse()}>
        <div class="w-full max-w-md mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2 text-purple-600">رد المساعد</h3>
          <p class="text-gray-700 whitespace-pre-wrap mb-4">{assistantResponse()}</p>
          <div class="flex space-x-4 justify-center">
            <button
              onClick={handleCopyResponse}
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              نسخ
            </button>
            <button
              onClick={handleListenResponse}
              class={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                loadingAudio() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loadingAudio()}
            >
              <Show when={!loadingAudio()} fallback="جاري التحميل...">
                استماع
              </Show>
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default Assistant;