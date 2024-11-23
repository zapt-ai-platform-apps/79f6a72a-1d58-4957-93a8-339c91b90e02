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

  // New states for sending message
  const [selectedUserId, setSelectedUserId] = createSignal('');
  const [messageContent, setMessageContent] = createSignal('');
  const [sendingMessage, setSendingMessage] = createSignal(false);

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

  // Function to send message to a user
  const handleSendMessage = async () => {
    if (!selectedUserId() || !messageContent()) {
      showNotification('يرجى اختيار مستخدم وكتابة رسالة.', 'error');
      return;
    }
    setSendingMessage(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedUserId(),
          message: messageContent(),
        }),
      });

      if (response.ok) {
        showNotification('تم إرسال الرسالة بنجاح.', 'success');
        setMessageContent('');
        setSelectedUserId('');
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء إرسال الرسالة.', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('حدث خطأ أثناء إرسال الرسالة.', 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم</h1>

      <div class="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('messages')}
          class={`px-4 py-2 rounded-lg cursor-pointer ${
            activeTab() === 'messages' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          الرسائل
        </button>
        <button
          onClick={() => setActiveTab('users')}
          class={`px-4 py-2 rounded-lg cursor-pointer ${
            activeTab() === 'users' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          المستخدمون
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          class={`px-4 py-2 rounded-lg cursor-pointer ${
            activeTab() === 'analytics' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          التحليلات
        </button>
        <button
          onClick={() => setActiveTab('sendMessage')}
          class={`px-4 py-2 rounded-lg cursor-pointer ${
            activeTab() === 'sendMessage' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          إرسال رسالة للمستخدمين
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
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>

      <Show when={activeTab() === 'analytics'}>
        <p class="text-lg text-center text-gray-700">قسم التحليلات قيد التطوير.</p>
      </Show>

      <Show when={activeTab() === 'sendMessage'}>
        <div class="w-full max-w-md">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">إرسال رسالة إلى مستخدم</h2>
          <div class="mb-4">
            <label class="block mb-2 text-lg font-semibold text-gray-700">اختر المستخدم:</label>
            <Show when={!loadingUsers()} fallback={<Loader />}>
              <select
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
                value={selectedUserId()}
                onInput={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">-- اختر المستخدم --</option>
                <For each={users()}>
                  {(user) => (
                    <option value={user.id}>{user.email}</option>
                  )}
                </For>
              </select>
            </Show>
          </div>
          <div class="mb-4">
            <label class="block mb-2 text-lg font-semibold text-gray-700">الرسالة:</label>
            <textarea
              class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              value={messageContent()}
              onInput={(e) => setMessageContent(e.target.value)}
            />
          </div>
          <button
            onClick={handleSendMessage}
            class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
              sendingMessage() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } transition duration-300 ease-in-out transform hover:scale-105`}
            disabled={sendingMessage()}
          >
            <Show when={!sendingMessage()} fallback="جاري الإرسال...">
              إرسال الرسالة
            </Show>
          </button>
        </div>
      </Show>
    </div>
  );
}

export default AdminDashboard;