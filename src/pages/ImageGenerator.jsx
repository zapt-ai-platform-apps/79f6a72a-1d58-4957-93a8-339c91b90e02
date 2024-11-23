import { useNavigate } from '@solidjs/router';
import { createSignal, Show, For } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';
import BackButton from '../components/BackButton';
import Loader from '../components/Loader';

function ImageGenerator() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();

  const [inputPrompt, setInputPrompt] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [generatedImageUrl, setGeneratedImageUrl] = createSignal('');
  const [selectedSize, setSelectedSize] = createSignal('512x512');
  const [selectedFormat, setSelectedFormat] = createSignal('png');
  const [selectedStyle, setSelectedStyle] = createSignal('');
  const [showAdvancedOptions, setShowAdvancedOptions] = createSignal(false);

  const sizes = ['256x256', '512x512', '1024x1024'];
  const formats = ['png', 'jpg', 'gif'];
  const styles = [
    { value: 'realistic', label: 'واقعي' },
    { value: 'oil_painting', label: 'رسم زيتي' },
    { value: 'cartoon', label: 'كرتون' },
    { value: '3d_render', label: 'ثلاثي الأبعاد' },
    { value: 'sketch', label: 'سكيتش' },
    { value: 'watercolor', label: 'ألوان مائية' },
  ];

  const examplePrompts = [
    'غابة سحرية تحت ضوء القمر',
    'مدينة مستقبلية بتقنية السايبر بانك',
    'قطة ترتدي قبعة وتلعب آلة الجيتار',
    'مناظر طبيعية جبلية عند شروق الشمس',
    'رسم زيتي لشارع مزدحم في ليلة ممطرة',
  ];

  const handleGenerateImage = async () => {
    if (inputPrompt().trim() === '') {
      showNotification('يرجى إدخال وصف للصورة.', 'error');
      return;
    }
    setLoading(true);

    try {
      const imageUrl = await createEvent('generate_image', {
        prompt: `${inputPrompt()}${selectedStyle() ? ', بأسلوب ' + selectedStyle() : ''}`,
        size: selectedSize(),
        format: selectedFormat(),
      });
      setGeneratedImageUrl(imageUrl);
      showNotification('تم إنشاء الصورة بنجاح.', 'success');
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
      link.download = `generated_image.${selectedFormat()}`;
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
        أدخل وصفًا تفصيليًا للصورة التي ترغب في إنشائها باستخدام الذكاء الاصطناعي. يمكنك اختيار حجم الصورة، صيغتها، ونمطها قبل الإنشاء.
      </p>

      <div class="w-full max-w-md">
        <textarea
          class="w-full h-32 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          placeholder="مثال: غابة سحرية تحت ضوء القمر..."
          value={inputPrompt()}
          onInput={(e) => setInputPrompt(e.target.value)}
          disabled={loading()}
        />

        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">أو اختر وصفًا من الأمثلة:</label>
          <select
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer box-border"
            onInput={(e) => setInputPrompt(e.target.value)}
            disabled={loading()}
          >
            <option value="">-- اختر مثالاً --</option>
            <For each={examplePrompts}>
              {(prompt) => (
                <option value={prompt}>{prompt}</option>
              )}
            </For>
          </select>
        </div>

        <button
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions())}
          class="w-full px-4 py-2 mb-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          {showAdvancedOptions() ? 'إخفاء الخيارات المتقدمة' : 'عرض الخيارات المتقدمة'}
        </button>

        <Show when={showAdvancedOptions()}>
          <div class="mb-4">
            <label class="block mb-2 text-lg font-semibold text-gray-700">اختر حجم الصورة:</label>
            <select
              class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer box-border"
              value={selectedSize()}
              onInput={(e) => setSelectedSize(e.target.value)}
              disabled={loading()}
            >
              <For each={sizes}>
                {(size) => (
                  <option value={size}>{size}</option>
                )}
              </For>
            </select>

            <label class="block mb-2 text-lg font-semibold text-gray-700">اختر صيغة الصورة:</label>
            <select
              class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer box-border"
              value={selectedFormat()}
              onInput={(e) => setSelectedFormat(e.target.value)}
              disabled={loading()}
            >
              <For each={formats}>
                {(format) => (
                  <option value={format}>{format.toUpperCase()}</option>
                )}
              </For>
            </select>

            <label class="block mb-2 text-lg font-semibold text-gray-700">اختر نمط الصورة:</label>
            <select
              class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer box-border"
              value={selectedStyle()}
              onInput={(e) => setSelectedStyle(e.target.value)}
              disabled={loading()}
            >
              <option value="">-- اختر النمط --</option>
              <For each={styles}>
                {(style) => (
                  <option value={style.value}>{style.label}</option>
                )}
              </For>
            </select>
          </div>
        </Show>

        <button
          onClick={handleGenerateImage}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
            loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback={<Loader />}>
            إنشاء الصورة
          </Show>
        </button>
      </div>

      <Show when={generatedImageUrl()}>
        <div class="mt-8 w-full max-w-md flex flex-col items-center">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">الصورة المولدة</h2>
          <img src={generatedImageUrl()} alt="الصورة المولدة" class="max-w-full h-auto rounded-lg shadow-lg mb-4" />
          <button
            onClick={handleDownloadImage}
            class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mb-2"
          >
            تحميل الصورة
          </button>
          <button
            onClick={() => navigate('/image-generator')}
            class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إنشاء صورة أخرى
          </button>
        </div>
      </Show>
    </div>
  );
}

export default ImageGenerator;