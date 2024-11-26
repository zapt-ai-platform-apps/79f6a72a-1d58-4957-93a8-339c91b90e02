import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

function Tools() {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = createSignal('');
  const [selectedDevTool, setSelectedDevTool] = createSignal('');

  const handleSelectionChange = (e) => {
    const value = e.target.value;
    setSelectedTool(value);
    if (value) {
      navigate(value);
    }
  };

  const handleDevSelectionChange = (e) => {
    const value = e.target.value;
    setSelectedDevTool(value);
    if (value) {
      navigate(value);
    }
  };

  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">أدوات</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        استفد من أدواتنا الحديثة المصممة لتعزيز إنتاجيتك وتحسين إمكانية الوصول بطريقة مبتكرة وسهلة الاستخدام.
      </p>

      <div class="w-full max-w-md mt-6">
        <label class="block mb-2 text-lg font-semibold">اختر الأداة:</label>
        <select
          class="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
          value={selectedTool()}
          onInput={handleSelectionChange}
        >
          <option value="">-- اختر الأداة --</option>
          <option value="/assistant">المساعد الذكي</option>
          <option value="/voice-assistant">المساعد الصوتي</option>
          <option value="/resume-builder">منشئ السيرة الذاتية</option>
          <option value="/text-editor">محرر النصوص</option>
          <option value="/radio">الراديو العربي</option>
        </select>
      </div>

      <div class="w-full max-w-md mt-8">
        <h2 class="text-2xl font-bold text-purple-600 mb-4">أدوات للمطورين ومنشئي المحتوى</h2>
        <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
          اكتشف الأدوات المخصصة للمطورين ومنشئي المحتوى لتحسين إنتاجيتك وإبداعك.
        </p>
        <label class="block mb-2 text-lg font-semibold">اختر الأداة:</label>
        <select
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
          value={selectedDevTool()}
          onInput={handleDevSelectionChange}
        >
          <option value="">-- اختر الأداة --</option>
          <option value="/content-generator">منشئ المحتوى</option>
          <option value="/image-generator">منشئ الصور الاحترافية</option>
        </select>
      </div>
    </div>
  );
}

export default Tools;