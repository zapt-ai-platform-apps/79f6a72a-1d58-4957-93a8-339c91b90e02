import { createSignal, onMount, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';
import { useNotification } from '../components/NotificationProvider';
import Loader from '../components/Loader';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);
  const [messages, setMessages] = createSignal([]);
  const [loadingMessages, setLoadingMessages] = createSignal(false);
  const showNotification = useNotification();

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email === 'daoudi.abdennour@gmail.com') {
      setUser(user);
      fetchAllMessages();
    } else {
      // ليس مشرفاً، إعادة التوجيه إلى الصفحة الرئيسية
      navigate('/', { replace: true });
    }
  });

  const fetchAllMessages = async () => {
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

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم</h1>
      <Show when={loadingMessages()}>
        <Loader loading={loadingMessages()} />
      </Show>
      <Show when={!loadingMessages() && messages().length === 0}>
        <p class="text-lg text-center text-gray-700">لا توجد رسائل لعرضها.</p>
      </Show>
      <Show when={!loadingMessages() && messages().length > 0}>
        <div class="w-full max-w-2xl">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">الرسائل:</h2>
          <For each={messages()}>
            {(message) => (
              <div class="mb-4 p-4 bg-white rounded-lg shadow-md">
                <p class="text-sm text-gray-600">تاريخ: {new Date(message.createdAt).toLocaleString()}</p>
                <p class="text-lg font-semibold text-gray-800 mt-2">نوع الرسالة: {message.type}</p>
                <p class="text-gray-800 mt-1">الاسم: {message.name}</p>
                <p class="text-gray-800 mt-1">البريد الإلكتروني: {message.email}</p>
                <Show when={message.phone}>
                  <p class="text-gray-800 mt-1">رقم الهاتف: {message.phone}</p>
                </Show>
                <p class="text-gray-700 mt-2 whitespace-pre-wrap">الرسالة: {message.message}</p>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

export default AdminDashboard;