import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { state } from '../store';
import { For, Show } from 'solid-js';
import { SolidMarkdown } from 'solid-markdown';
import { createEvent } from '../supabaseClient';

function AssistantConversation() {
  const navigate = useNavigate();
  const [loadingIndex, setLoadingIndex] = createSignal(null);
  const [playingIndex, setPlayingIndex] = createSignal(null);
  const [errorIndex, setErrorIndex] = createSignal(null);

  const playAudio = async (text, index) => {
    setLoadingIndex(index);
    try {
      const audioUrl = await createEvent('text_to_speech', {
        text: text,
      });
      const audio = new Audio(audioUrl);
      audio.play();
      setPlayingIndex(index);
      audio.onended = () => {
        setPlayingIndex(null);
      };
    } catch (error) {
      console.error('Error converting text to speech:', error);
      alert('حدث خطأ أثناء تشغيل الصوت.');
    } finally {
      setLoadingIndex(null);
    }
  };

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
          {(message, index) => (
            <div class={`p-4 rounded-lg shadow-md ${message.role === 'assistant' ? 'bg-white' : 'bg-purple-100'} transition duration-300 ease-in-out transform hover:scale-105`}>
              <SolidMarkdown class="prose prose-lg text-gray-700" children={message.content} />
              {message.role === 'assistant' && (
                <div class="flex gap-2 mt-2">
                  <button
                    onClick={() => copyText(message.content)}
                    class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  >
                    نسخ النص
                  </button>
                  <button
                    onClick={() => playAudio(message.content, index())}
                    class={`px-4 py-2 ${playingIndex() === index() ? 'bg-green-600' : 'bg-green-500'} text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
                    disabled={loadingIndex() !== null}
                  >
                    <Show when={loadingIndex() === index()}>
                      جاري التشغيل...
                    </Show>
                    <Show when={loadingIndex() !== index()}>
                      {playingIndex() === index() ? 'يتم التشغيل' : 'استماع'}
                    </Show>
                  </button>
                </div>
              )}
            </div>
          )}
        </For>
        <Show when={errorIndex() !== null}>
          <div class="text-red-500 mt-2">حدث خطأ أثناء تحويل النص إلى كلام.</div>
        </Show>
      </div>
    </div>
  );
}

export default AssistantConversation;