import { createSignal, Show } from 'solid-js';
import Assistant from './components/Assistant';
import SmartTextEditor from './components/SmartTextEditor';

function App() {
  const [showAssistant, setShowAssistant] = createSignal(false);
  const [showEditor, setShowEditor] = createSignal(false);

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center text-gray-800 p-4" dir="rtl">
      <img src="https://images.unsplash.com/photo-1521931961826-fe48677230a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwyfHxBcHAlMjBpY29uJTIwcmVwcmVzZW50aW5nJTIwYWNjZXNzaWJpbGl0eSUyMGZvciUyMHRoZSUyMGJsaW5kfGVufDB8fHx8MTczMTAyOTM4N3ww&ixlib=rb-4.0.3&q=80&w=1080"  alt="Blind Accessibility Icon" data-image-request="App icon representing accessibility for the blind" class="w-24 h-24 mb-4" />
      <h1 class="text-4xl font-bold text-purple-600 mb-4">Blind Accessibility</h1>
      <p class="text-xl text-gray-700 text-center max-w-md mb-8">
        نوفر مجموعة شاملة من الأدوات والموارد لتعزيز الوصول الرقمي للأشخاص المكفوفين وضعاف البصر.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => setShowAssistant(true)}
          class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المساعد الصوتي
        </button>
        <button
          onClick={() => setShowEditor(true)}
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          محرر النصوص الذكي
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