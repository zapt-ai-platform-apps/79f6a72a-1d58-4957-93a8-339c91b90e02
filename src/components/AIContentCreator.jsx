import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { setState } from '../store';

function AIContentCreator() {
  const [contentType, setContentType] = createSignal('');
  const [userPrompt, setUserPrompt] = createSignal('');
  const navigate = useNavigate();

  const handleGenerate = () => {
    setState('contentType', contentType());
    setState('userPrompt', userPrompt());
    navigate('/generated-content');
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pb-16">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">منشئ المحتوى بالذكاء الاصطناعي</h2>

      <div class="w-full max-w-2xl space-y-4">
        <input
          type="text"
          value={contentType()}
          onInput={(e) => setContentType(e.target.value)}
          placeholder="أدخل نوع المحتوى (مقال، قصة، إلخ)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
        />
        <textarea
          value={userPrompt()}
          onInput={(e) => setUserPrompt(e.target.value)}
          placeholder="أدخل الموضوع"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="5"
        />
        <button
          onClick={handleGenerate}
          class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${(!contentType() || !userPrompt()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!contentType() || !userPrompt()}
        >
          إنشاء المحتوى
        </button>
      </div>
    </div>
  );
}

export default AIContentCreator;