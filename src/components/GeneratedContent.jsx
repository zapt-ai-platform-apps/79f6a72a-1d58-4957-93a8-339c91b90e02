import { useNavigate } from '@solidjs/router';
import { state } from '../store';
import { SolidMarkdown } from 'solid-markdown';

function GeneratedContent() {
  const navigate = useNavigate();

  const copyContent = () => {
    navigator.clipboard.writeText(state.generatedContent)
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
        onClick={() => navigate('/content-creator')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>

      <h2 class="text-3xl font-bold text-purple-600 mb-6">المحتوى الذي تم إنشاؤه</h2>

      <div class="w-full max-w-2xl space-y-4">
        <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
          <SolidMarkdown class="prose prose-lg text-gray-700" children={state.generatedContent} />
        </div>
        <div class="mt-2 flex flex-wrap gap-4">
          <button
            onClick={copyContent}
            class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            نسخ المحتوى
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneratedContent;