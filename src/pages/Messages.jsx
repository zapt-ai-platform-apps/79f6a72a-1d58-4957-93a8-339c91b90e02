import { createSignal, onMount, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';
import Loader from '../components/Loader';
import { useNotification } from '../components/NotificationProvider';

function Messages() {
  const navigate = useNavigate();
  const [messages, setMessages] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const showNotification = useNotification();

  onMount(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getMessages', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء جلب الرسائل.', 'error');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      showNotification('حدث خطأ أثناء جلب الرسائل.', 'error');
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الرسائل</h1>
      <Show when={loading()}>
        <Loader loading={loading()} />
      </Show>
      <Show when={!loading() && messages().length === 0}>
        <p class="text-lg text-center text-gray-700">لا توجد رسائل لعرضها.</p>
      </Show>
      <Show when={!loading() && messages().length > 0}>
        <div class="w-full max-w-md">
          <For each={messages()}>
            {(message) => (
              <div class="mb-4 p-4 bg-white rounded-lg shadow-md">
                <p class="text-sm text-gray-600">تاريخ: {new Date(message.createdAt).toLocaleString()}</p>
                <p class="text-lg font-semibold text-gray-800 mt-2">نوع الرسالة: {message.type}</p>
                <p class="text-gray-700 mt-2 whitespace-pre-wrap">الرسالة: {message.message}</p>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

export default Messages;