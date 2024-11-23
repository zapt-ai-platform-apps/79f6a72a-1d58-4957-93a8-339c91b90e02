import { createSignal, onMount, Show, For } from 'solid-js';
import { supabase } from '../../supabaseClient';
import { useNotification } from '../NotificationProvider';
import Loader from '../Loader';

function MessageManagement() {
  const [messages, setMessages] = createSignal([]);
  const [loadingMessages, setLoadingMessages] = createSignal(false);
  const [loadingDelete, setLoadingDelete] = createSignal(false);
  const showNotification = useNotification();

  onMount(() => {
    fetchMessages();
  });

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getAllMessages', {
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
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setLoadingDelete(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/deleteMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });
      if (response.ok) {
        showNotification('تم حذف الرسالة بنجاح.', 'success');
        setMessages(messages().filter((message) => message.id !== messageId));
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء حذف الرسالة.', 'error');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showNotification('حدث خطأ أثناء حذف الرسالة.', 'error');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div>
      <h2 class="text-2xl font-bold text-purple-600 mb-4">إدارة الرسائل</h2>
      <Show when={loadingMessages()}>
        <Loader loading={loadingMessages()} />
      </Show>
      <Show when={!loadingMessages() && messages().length > 0}>
        <div class="space-y-4">
          <For each={messages()}>
            {(message) => (
              <div class="p-4 bg-white rounded-lg shadow-md relative">
                <button
                  onClick={() => handleDeleteMessage(message.id)}
                  class={`absolute top-2 left-2 text-red-500 font-bold cursor-pointer ${
                    loadingDelete() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loadingDelete()}
                  aria-label="حذف الرسالة"
                >
                  ✕
                </button>
                <p class="text-sm text-gray-600">تاريخ: {new Date(message.createdAt).toLocaleString()}</p>
                <p class="text-lg font-semibold text-gray-800 mt-2">النوع: {message.type}</p>
                <p class="text-gray-700 mt-2">الاسم: {message.name}</p>
                <p class="text-gray-700 mt-2">البريد الإلكتروني: {message.email}</p>
                <Show when={message.phone}>
                  <p class="text-gray-700 mt-2">رقم الهاتف: {message.phone}</p>
                </Show>
                <p class="text-gray-700 mt-2 whitespace-pre-wrap">الرسالة: {message.message}</p>
              </div>
            )}
          </For>
        </div>
      </Show>
      <Show when={!loadingMessages() && messages().length === 0}>
        <p class="text-lg text-center text-gray-700">لا توجد رسائل لعرضها.</p>
      </Show>
    </div>
  );
}

export default MessageManagement;