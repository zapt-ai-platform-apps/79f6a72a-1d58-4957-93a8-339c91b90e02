import { createSignal, For, Show, onMount } from 'solid-js';
import { createNotification } from '../components/Notification';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function AdminDashboard() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();
  const [messages, setMessages] = createSignal([]);
  const [filterType, setFilterType] = createSignal('');
  const [loading, setLoading] = createSignal(true);
  
  const fetchMessages = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  onMount(() => {
    fetchMessages();
  });

  const filteredMessages = () => {
    if (filterType()) {
      return messages().filter(message => message.type === filterType());
    }
    return messages();
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

        <Show when={!loading()} fallback={<p class="text-center">جاري تحميل الرسائل...</p>}>
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
    </div>
  );
}

export default AdminDashboard;