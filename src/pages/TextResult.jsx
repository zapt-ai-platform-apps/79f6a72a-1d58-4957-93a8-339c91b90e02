import { useNavigate, useLocation } from '@solidjs/router';
import { createSignal } from 'solid-js';

function TextResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [outputText] = createSignal(location.state?.outputText || '');

  if (!location.state?.outputText) {
    navigate('/text-editor');
  }

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
        onClick={() => navigate('/text-editor')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">النتيجة</h1>

      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
        <div class="prose prose-lg text-gray-700 mb-4 whitespace-pre-wrap">
          {outputText()}
        </div>
        <button
          onClick={handleCopyOutput}
          class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          نسخ النص
        </button>
      </div>
    </div>
  );
}

export default TextResult;