import { createSignal, onMount, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';

function AIContentCreator() {
  const navigate = useNavigate();
  const [userPrompt, setUserPrompt] = createSignal('');
  const [generatedContent, setGeneratedContent] = createSignal('');
  const [isListening, setIsListening] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [contentType, setContentType] = createSignal('مقال');

  const contentTypes = ['مقال', 'قصة', 'بوست مدونة', 'تقرير', 'قصيدة'];

  let recognition;

  // Initialize speech recognition
  onMount(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'ar-EG';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserPrompt(transcript);
        stopListening();
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
      };
    } else {
      alert('متصفحك لا يدعم التعرف على الصوت.');
    }
  });

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!userPrompt()) return;
    setIsLoading(true);
    try {
      const prompt = `اكتب ${contentType()} حول الموضوع التالي: ${userPrompt()}`;
      const response = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setGeneratedContent(response);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyContent = () => {
    navigator.clipboard.writeText(generatedContent())
      .then(() => {
        alert('تم نسخ المحتوى إلى الحافظة');
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
      <h2 class="text-3xl font-bold text-purple-600 mb-6">منشئ المحتوى بالذكاء الاصطناعي</h2>

      <div class="w-full max-w-2xl space-y-4">
        <label for="content-type" class="block text-gray-700">اختر نوع المحتوى:</label>
        <select
          id="content-type"
          value={contentType()}
          onInput={(e) => setContentType(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
        >
          <For each={contentTypes}>
            {(type) => (
              <option value={type}>{type}</option>
            )}
          </For>
        </select>

        <textarea
          value={userPrompt()}
          onInput={(e) => setUserPrompt(e.target.value)}
          placeholder="اكتب موضوع المحتوى هنا..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="4"
        ></textarea>

        <div class="flex flex-wrap gap-4">
          <button
            onClick={handleGenerateContent}
            class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading() || !userPrompt()}
          >
            {isLoading() ? 'جاري التحميل...' : 'توليد المحتوى'}
          </button>
          <button
            onClick={isListening() ? stopListening : startListening}
            class={`flex-1 px-6 py-3 ${isListening() ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
            disabled={isLoading()}
          >
            {isListening() ? 'إيقاف التحدث' : 'ابدأ التحدث'}
          </button>
        </div>

        <Show when={generatedContent()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <p class="text-gray-700 whitespace-pre-wrap">{generatedContent()}</p>
          </div>
          <div class="mt-2 flex flex-wrap gap-4">
            <button
              onClick={copyContent}
              class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              نسخ المحتوى
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default AIContentCreator;