import { useNavigate } from '@solidjs/router';
import { createSignal, Show, For } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';

function ContentGenerator() {
  const navigate = useNavigate();

  const contentTypes = [
    { value: 'article', label: 'مقال' },
    { value: 'social_media_post', label: 'منشور على وسائل التواصل الاجتماعي' },
    { value: 'email', label: 'بريد إلكتروني' },
    { value: 'product_description', label: 'وصف منتج' },
    { value: 'advertisement', label: 'إعلان' },
    { value: 'blog_post', label: 'منشور مدونة' },
    { value: 'news_report', label: 'تقرير إخباري' },
    { value: 'speech', label: 'خطاب' },
    { value: 'story', label: 'قصة قصيرة' },
    { value: 'poem', label: 'قصيدة' },
    { value: 'report', label: 'تقرير' },
    { value: 'letter', label: 'رسالة' },
    // يمكنك إضافة المزيد من أنواع المحتوى هنا
  ];

  const [inputText, setInputText] = createSignal('');
  const [selectedContentType, setSelectedContentType] = createSignal('');
  const [generatedContent, setGeneratedContent] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const { NotificationComponent, showNotification } = createNotification();

  const handleGenerateContent = async () => {
    if (inputText().trim() === '' || selectedContentType() === '') return;
    setLoading(true);
    const prompt = `أريد منك كتابة ${getContentTypeLabel(selectedContentType())} حول الموضوع التالي: ${inputText()}. الرجاء أن يكون المحتوى جذاباً ومفيداً.`;
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setGeneratedContent(result || 'لم يتم توليد المحتوى.');
    } catch (error) {
      console.error('Error:', error);
      setGeneratedContent('حدث خطأ أثناء توليد المحتوى.');
      showNotification('حدث خطأ أثناء توليد المحتوى.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeLabel = (value) => {
    const type = contentTypes.find((type) => type.value === value);
    return type ? type.label : '';
  };

  const handleCopyContent = () => {
    if (generatedContent()) {
      navigator.clipboard
        .writeText(generatedContent())
        .then(() => {
          showNotification('تم نسخ المحتوى إلى الحافظة', 'success');
        })
        .catch((error) => {
          console.error('فشل النسخ:', error);
          showNotification('فشل نسخ المحتوى', 'error');
        });
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">منشئ المحتوى بالذكاء الاصطناعي</h1>

      <div class="w-full max-w-md">
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">اختر نوع المحتوى:</label>
          <select
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
            value={selectedContentType()}
            onInput={(e) => setSelectedContentType(e.target.value)}
            disabled={loading()}
          >
            <option value="">-- اختر نوع المحتوى --</option>
            <For each={contentTypes}>
              {(type) => (
                <option value={type.value}>{type.label}</option>
              )}
            </For>
          </select>
        </div>

        <textarea
          class="w-full h-32 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          placeholder="أدخل الموضوع أو الفكرة هنا..."
          value={inputText()}
          onInput={(e) => setInputText(e.target.value)}
          disabled={loading()}
        />

        <button
          onClick={handleGenerateContent}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
            loading() || inputText().trim() === '' || selectedContentType() === '' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          disabled={loading() || inputText().trim() === '' || selectedContentType() === ''}
        >
          <Show when={!loading()} fallback="جاري التوليد...">
            توليد المحتوى
          </Show>
        </button>
      </div>

      <Show when={generatedContent()}>
        <div class="w-full max-w-md mt-6 p-6 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          <h3 class="text-xl font-bold mb-4 text-purple-600">المحتوى المولد:</h3>
          <div class="prose prose-lg text-gray-700 mb-4">
            {generatedContent()}
          </div>
          <button
            onClick={handleCopyContent}
            class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            نسخ المحتوى
          </button>
        </div>
      </Show>
    </div>
  );
}

export default ContentGenerator;