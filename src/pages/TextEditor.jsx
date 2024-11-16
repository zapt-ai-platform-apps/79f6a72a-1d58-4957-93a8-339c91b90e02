import { useNavigate } from '@solidjs/router';
import { createSignal, Show, For, createMemo } from 'solid-js';
import { createEvent } from '../supabaseClient';

function TextEditor() {
  const navigate = useNavigate();

  const [inputText, setInputText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [selectedOption, setSelectedOption] = createSignal('');
  const [selectedLanguage, setSelectedLanguage] = createSignal('');

  const showLanguageSelection = createMemo(() => selectedOption() === 'translation');

  const languages = [
    { value: 'en', label: 'الإنجليزية' },
    { value: 'fr', label: 'الفرنسية' },
    { value: 'es', label: 'الإسبانية' },
    { value: 'de', label: 'الألمانية' },
    { value: 'it', label: 'الإيطالية' },
    { value: 'tr', label: 'التركية' },
    { value: 'ru', label: 'الروسية' },
  ];

  const handleProcessText = async () => {
    if (inputText().trim() === '') return alert('يرجى إدخال النص.');
    if (selectedOption() === '') return alert('يرجى اختيار العملية.');
    if (showLanguageSelection() && selectedLanguage() === '') return alert('يرجى اختيار اللغة.');

    setLoading(true);
    let prompt = '';
    switch (selectedOption()) {
      case 'tashkeel':
        prompt = `الرجاء تشكيل النص التالي: ${inputText()}`;
        break;
      case 'correction':
        prompt = `الرجاء تصحيح الأخطاء الإملائية والنحوية في النص التالي: ${inputText()}`;
        break;
      case 'paraphrase':
        prompt = `الرجاء إعادة صياغة النص التالي بأسلوب مختلف مع الحفاظ على المعنى: ${inputText()}`;
        break;
      case 'translation': {
        const languageLabel = languages.find((lang) => lang.value === selectedLanguage())?.label || '';
        prompt = `الرجاء ترجمة النص التالي إلى ${languageLabel}: ${inputText()}`;
        break;
      }
      default:
        break;
    }
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      navigate('/text-result', {
        state: {
          outputText: result || 'لم يتم الحصول على نتيجة.',
        },
      });
    } catch (error) {
      console.error('Error:', error);
      navigate('/text-result', {
        state: {
          outputText: 'حدث خطأ أثناء معالجة النص.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
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
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">اختر العملية:</label>
          <select
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
            value={selectedOption()}
            onInput={(e) => {
              setSelectedOption(e.target.value);
              setSelectedLanguage('');
            }}
          >
            <option value="">-- اختر العملية --</option>
            <option value="tashkeel">تشكيل النص</option>
            <option value="correction">تصحيح النص</option>
            <option value="paraphrase">إعادة صياغة النص</option>
            <option value="translation">ترجمة النص</option>
          </select>
        </div>

        <Show when={showLanguageSelection()}>
          <div class="mb-4">
            <label class="block mb-2 text-lg font-semibold text-gray-700">اختر اللغة:</label>
            <select
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
              value={selectedLanguage()}
              onInput={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="">-- اختر اللغة --</option>
              <For each={languages}>
                {(language) => (
                  <option value={language.value}>{language.label}</option>
                )}
              </For>
            </select>
          </div>
        </Show>

        <button
          onClick={handleProcessText}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
            loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          disabled={
            loading() ||
            inputText().trim() === '' ||
            selectedOption() === '' ||
            (showLanguageSelection() && selectedLanguage() === '')
          }
        >
          <Show when={!loading()} fallback="جاري المعالجة...">
            معالجة النص
          </Show>
        </button>
      </div>
    </div>
  );
}

export default TextEditor;