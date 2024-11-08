import { createSignal, Show } from 'solid-js';
import Assistant from './components/Assistant';
import SmartTextEditor from './components/SmartTextEditor';

function App() {
  const [showAssistant, setShowAssistant] = createSignal(false);
  const [showEditor, setShowEditor] = createSignal(false);

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center text-gray-800 p-4" dir="rtl">
      <h1 class="text-4xl font-bold text-purple-600 mb-4">أدوات Blind Accessibility</h1>
      <p class="text-xl text-gray-700 text-center max-w-md mb-8">
        نوفر مجموعة شاملة من الأدوات والموارد لتعزيز الوصول الرقمي للأشخاص المكفوفين وضعاف البصر.
      </p>
      <div class="flex space-x-4">
        <button
          onClick={() => setShowAssistant(true)}
          class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المساعد الذكي
        </button>
        <button
          onClick={() => setShowEditor(true)}
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          أداة محرر النصوص الذكي
        </button>
      </div>
      <Show when={showAssistant()}>
        <Assistant onClose={() => setShowAssistant(false)} />
      </Show>
      <Show when={showEditor()}>
        <SmartTextEditor onClose={() => setShowEditor(false)} />
      </Show>
    </div>
  );
}

export default App;