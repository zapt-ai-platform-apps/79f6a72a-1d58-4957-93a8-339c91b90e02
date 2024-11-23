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
  const [users, setUsers] = createSignal([]);
  const [loadingUsers, setLoadingUsers] = createSignal(false);
  const showNotification = useNotification();
  const [activeTab, setActiveTab] = createSignal('messages');

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email === 'daoudi.abdennour@gmail.com') {
      setUser(user);
      fetchAllMessages();
      fetchAllUsers();
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

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getUsers', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData.users);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء جلب المستخدمين.', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('حدث خطأ أثناء جلب المستخدمين.', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم</h1>

      <div class="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('messages')}
          class={`px-4 py-2 rounded-lg ${
            activeTab() === 'messages' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          } cursor-pointer`}
        >
          الرسائل
        </button>
        <button
          onClick={() => setActiveTab('users')}
          class={`px-4 py-2 rounded-lg ${
            activeTab() === 'users' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          } cursor-pointer`}
        >
          المستخدمون
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          class={`px-4 py-2 rounded-lg ${
            activeTab() === 'analytics' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          } cursor-pointer`}
        >
          التحليلات
        </button>
      </div>

      <Show when={activeTab() === 'messages'}>
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
      </Show>

      <Show when={activeTab() === 'users'}>
        <Show when={loadingUsers()}>
          <Loader loading={loadingUsers()} />
        </Show>
        <Show when={!loadingUsers() && users().length === 0}>
          <p class="text-lg text-center text-gray-700">لا يوجد مستخدمون لعرضهم.</p>
        </Show>
        <Show when={!loadingUsers() && users().length > 0}>
          <div class="w-full max-w-2xl">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">المستخدمون:</h2>
            <For each={users()}>
              {(userItem) => (
                <div class="mb-4 p-4 bg-white rounded-lg shadow-md">
                  <p class="text-lg font-semibold text-gray-800 mt-2">البريد الإلكتروني: {userItem.email}</p>
                  <p class="text-gray-800 mt-1">المنشأ في: {new Date(userItem.created_at).toLocaleString()}</p>
                  {/* يمكنك إضافة المزيد من تفاصيل المستخدم هنا */}
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>

      <Show when={activeTab() === 'analytics'}>
        {/* التحليلات ستكون هنا */}
        <p class="text-lg text-center text-gray-700">قسم التحليلات قيد التطوير.</p>
      </Show>
    </div>
  );
}

export default AdminDashboard;