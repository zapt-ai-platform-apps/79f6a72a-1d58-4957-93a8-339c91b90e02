import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';
import BackButton from '../components/BackButton';

function ImageGenerator() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();

  const [inputPrompt, setInputPrompt] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [generatedImageUrl, setGeneratedImageUrl] = createSignal('');

  const handleGenerateImage = async () => {
    if (inputPrompt().trim() === '') {
      showNotification('يرجى إدخال وصف للصورة.', 'error');
      return;
    }
    setLoading(true);

    try {
      const imageUrl = await createEvent('generate_image', {
        prompt: inputPrompt(),
      });
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      showNotification('حدث خطأ أثناء إنشاء الصورة.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (generatedImageUrl()) {
      const link = document.createElement('a');
      link.href = generatedImageUrl();
      link.download = 'generated_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('تم تحميل الصورة.', 'success');
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <BackButton />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">منشئ الصور الاحترافي بالذكاء الاصطناعي</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        أدخل وصفاً للصورة التي ترغب في إنشائها باستخدام الذكاء الاصطناعي.
      </p>

      <div class="w-full max-w-md">
        <textarea
          class="w-full h-32 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          placeholder="أدخل وصف الصورة هنا..."
          value={inputPrompt()}
          onInput={(e) => setInputPrompt(e.target.value)}
          disabled={loading()}
        />

        <button
          onClick={handleGenerateImage}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
            loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback="جاري إنشاء الصورة...">
            إنشاء الصورة
          </Show>
        </button>
      </div>

      <Show when={generatedImageUrl()}>
        <div class="mt-8">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">الصورة المولدة</h2>
          <img src={generatedImageUrl()} alt="الصورة المولدة" class="max-w-full h-auto rounded-lg shadow-lg" />
          <button
            onClick={handleDownloadImage}
            class="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            تحميل الصورة
          </button>
        </div>
      </Show>
    </div>
  );
}

export default ImageGenerator;