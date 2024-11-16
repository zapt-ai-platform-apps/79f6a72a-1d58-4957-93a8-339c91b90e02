import { useNavigate } from '@solidjs/router';
import { createSignal, Show, For } from 'solid-js';
import { createEvent } from '../supabaseClient';

function TextEditor() {
  const navigate = useNavigate();

  const [inputText, setInputText] = createSignal('');
  const [outputText, setOutputText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [selectedOption, setSelectedOption] = createSignal('');
  const [selectedLanguage, setSelectedLanguage] = createSignal('');
  const [showLanguageSelection, setShowLanguageSelection] = createSignal(false);

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
    if (inputText().trim() === '') return;
    if (selectedOption() === '') return;

    if (selectedOption() === 'translation' && !showLanguageSelection()) {
      setShowLanguageSelection(true);
      return;
    }

    if (selectedOption() === 'translation' && selectedLanguage() === '') {
      alert('يرجى اختيار اللغة المستهدفة.');
      return;
    }

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
      case 'translation':
        const languageLabel = languages.find((lang) => lang.value === selectedLanguage())?.label || '';
        prompt = `الرجاء ترجمة النص التالي إلى ${languageLabel}: ${inputText()}`;
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
              setShowLanguageSelection(false);
            }}
          >
            <option value="">-- اختر العملية --</option>
            <option value="tashkeel">تشكيل النص</option>
            <option value="correction">تصحيح النص</option>
            <option value="paraphrase">إعادة صياغة النص</option>
            <option value="translation">ترجمة النص</option>
          </select>
        </div>

        <button
          onClick={handleProcessText}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback="جاري المعالجة...">
            معالجة النص
          </Show>
        </button>

        <Show when={showLanguageSelection() && selectedOption() === 'translation'}>
          <div class="mt-4 mb-4">
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

          <button
            onClick={handleProcessText}
            class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading() || selectedLanguage() === '' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading() || selectedLanguage() === ''}
          >
            <Show when={!loading()} fallback="جاري الترجمة...">
              ترجمة النص
            </Show>
          </button>
        </Show>

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