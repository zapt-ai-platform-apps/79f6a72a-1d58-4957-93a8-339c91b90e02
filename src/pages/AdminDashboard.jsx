import { createSignal, For, Show, onMount } from 'solid-js';
import { createNotification } from '../components/Notification';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function AdminDashboard() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();
  const [messages, setMessages] = createSignal([]);
  const [users, setUsers] = createSignal([]);
  const [filterType, setFilterType] = createSignal('');
  const [loadingMessages, setLoadingMessages] = createSignal(true);
  const [loadingUsers, setLoadingUsers] = createSignal(true);
  const [activeTab, setActiveTab] = createSignal('messages');
  
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getMessages', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else if (response.status === 403) {
        showNotification('غير مصرح لك بالوصول إلى هذه الصفحة.', 'error');
        navigate('/');
      } else {
        showNotification('حدث خطأ أثناء جلب الرسائل.', 'error');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      showNotification('حدث خطأ أثناء جلب الرسائل.', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getUsers', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else if (response.status === 403) {
        showNotification('غير مصرح لك بالوصول إلى هذه الصفحة.', 'error');
        navigate('/');
      } else {
        showNotification('حدث خطأ أثناء جلب المستخدمين.', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('حدث خطأ أثناء جلب المستخدمين.', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  onMount(() => {
    fetchMessages();
    fetchUsers();
  });

  const filteredMessages = () => {
    if (filterType()) {
      return messages().filter(message => message.type === filterType());
    }
    return messages();
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/deleteUser', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId })
      });

      if (response.ok) {
        showNotification('تم حذف المستخدم بنجاح.', 'success');
        setUsers(users().filter(user => user.id !== userId));
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حذف المستخدم.', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('حدث خطأ أثناء حذف المستخدم.', 'error');
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم الإدارية</h1>
      <div class="flex space-x-reverse space-x-4 mb-6">
        <button
          class={`px-4 py-2 rounded-lg ${activeTab() === 'messages' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
          onClick={() => setActiveTab('messages')}
        >
          إدارة الرسائل
        </button>
        <button
          class={`px-4 py-2 rounded-lg ${activeTab() === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
          onClick={() => setActiveTab('users')}
        >
          إدارة المستخدمين
        </button>
      </div>

      <Show when={activeTab() === 'messages'}>
        <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
          مرحبًا، يمكنك هنا عرض جميع الرسائل الواردة من المستخدمين.
        </p>
        <div class="w-full max-w-4xl">
          <div class="flex justify-between items-center mb-4">
            <label class="flex items-center space-x-2">
              <span class="text-lg font-semibold text-gray-700">تصفية حسب النوع:</span>
              <select
                class="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
                value={filterType()}
                onInput={(e) => setFilterType(e.target.value)}
              >
                <option value="">الكل</option>
                <option value="contact">تواصل معنا</option>
                <option value="join">انضم إلينا</option>
              </select>
            </label>
          </div>

          <Show when={!loadingMessages()} fallback={<p class="text-center">جاري تحميل الرسائل...</p>}>
            <Show when={filteredMessages().length > 0} fallback={<p class="text-center">لا توجد رسائل.</p>}>
              <For each={filteredMessages()}>
                {(message) => (
                  <div class="mb-4 p-4 border border-gray-300 rounded-lg shadow-md">
                    <p><span class="font-bold">الاسم:</span> {message.name}</p>
                    <p><span class="font-bold">البريد الإلكتروني:</span> {message.email}</p>
                    <Show when={message.phone}>
                      <p><span class="font-bold">رقم الهاتف:</span> {message.phone}</p>
                    </Show>
                    <p><span class="font-bold">النوع:</span> {message.type === 'contact' ? 'تواصل معنا' : 'انضم إلينا'}</p>
                    <p><span class="font-bold">الرسالة:</span></p>
                    <p class="whitespace-pre-wrap">{message.message}</p>
                    <p class="text-sm text-gray-500 mt-2">{new Date(message.created_at).toLocaleString()}</p>
                  </div>
                )}
              </For>
            </Show>
          </Show>
        </div>
      </Show>

      <Show when={activeTab() === 'users'}>
        <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
          مرحبًا، يمكنك هنا إدارة المستخدمين.
        </p>
        <div class="w-full max-w-4xl">
          <Show when={!loadingUsers()} fallback={<p class="text-center">جاري تحميل المستخدمين...</p>}>
            <Show when={users().length > 0} fallback={<p class="text-center">لا يوجد مستخدمون.</p>}>
              <table class="min-w-full bg-white">
                <thead>
                  <tr>
                    <th class="py-2 border-b">البريد الإلكتروني</th>
                    <th class="py-2 border-b">الاسم</th>
                    <th class="py-2 border-b">تاريخ الإنشاء</th>
                    <th class="py-2 border-b">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={users()}>
                    {(user) => (
                      <tr>
                        <td class="py-2 border-b text-center">{user.email}</td>
                        <td class="py-2 border-b text-center">{user.user_metadata?.full_name || '-'}</td>
                        <td class="py-2 border-b text-center">{new Date(user.created_at).toLocaleString()}</td>
                        <td class="py-2 border-b text-center">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            class="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 cursor-pointer"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </Show>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default AdminDashboard;