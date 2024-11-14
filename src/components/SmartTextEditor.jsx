import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { setState } from '../store';

function SmartTextEditor() {
  const [userText, setUserText] = createSignal('');
  const [selectedOption, setSelectedOption] = createSignal('');
  const navigate = useNavigate();

  const handleProcess = () => {
    setState('userText', userText());
    setState('selectedOption', selectedOption());
    navigate('/processed-text');
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pb-16">
      <button
        onClick={() => navigate('/tools')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">محرر النصوص الذكي</h2>
      <div class="w-full max-w-2xl space-y-4">
        <textarea
          value={userText()}
          onInput={(e) => setUserText(e.target.value)}
          placeholder="أدخل النص هنا..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="10"
        />
        <select
          value={selectedOption()}
          onInput={(e) => setSelectedOption(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
        >
          <option value="" disabled selected>
            اختر عملية
          </option>
          <option value="تصحيح الأخطاء الإملائية">تصحيح الأخطاء الإملائية</option>
          <option value="إعادة الصياغة">إعادة الصياغة</option>
          <option value="تحويل إلى لهجة مختلفة">تحويل إلى لهجة مختلفة</option>
        </select>
        <button
          onClick={handleProcess}
          class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${(!userText() || !selectedOption()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!userText() || !selectedOption()}
        >
          معالجة النص
        </button>
      </div>
    </div>
  );
}

export default SmartTextEditor;