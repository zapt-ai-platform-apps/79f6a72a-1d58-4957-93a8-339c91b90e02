import { useNavigate } from '@solidjs/router';
import { state } from '../store';
import { For } from 'solid-js';
import { SolidMarkdown } from 'solid-markdown';

function AssistantConversation() {
  const navigate = useNavigate();

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('تم نسخ النص إلى الحافظة');
      })
      .catch(err => {
        console.error('Error copying text:', err);
      });
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <button
        onClick={() => navigate('/assistant')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">المحادثة</h2>

      <div class="w-full max-w-2xl space-y-4">
        <For each={state.assistantConversation}>
          {(message) => (
            <div class={`p-4 rounded-lg shadow-md ${message.role === 'assistant' ? 'bg-white' : 'bg-purple-100'} transition duration-300 ease-in-out transform hover:scale-105`}>
              <SolidMarkdown class="prose prose-lg text-gray-700" children={message.content} />
              {message.role === 'assistant' && (
                <button
                  onClick={() => copyText(message.content)}
                  class="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  نسخ النص
                </button>
              )}
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default AssistantConversation;