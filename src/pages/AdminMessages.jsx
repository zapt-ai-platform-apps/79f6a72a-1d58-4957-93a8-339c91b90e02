import { createSignal, onMount, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';
import Loader from '../components/Loader';

function AdminMessages() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [messages, setMessages] = createSignal([]);

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user?.email !== 'daoudi.abdennour@gmail.com') {
      // If not admin, redirect to home page
      navigate('/', { replace: true });
    } else {
      fetchMessages();
    }
  });

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/getMessages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate('/admin')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الرسائل</h1>

      <Show when={loading()}>
        <Loader />
      </Show>
      <Show when={!loading()}>
        <div class="w-full max-w-4xl">
          <For each={messages()}>
            {(msg) => (
              <div class="mb-4 border border-gray-300 rounded-lg p-4">
                <p><strong>النوع:</strong> {msg.type === 'contact' ? 'اتصل بنا' : 'انضم إلينا'}</p>
                <p><strong>الاسم:</strong> {msg.name}</p>
                <p><strong>البريد الإلكتروني:</strong> {msg.email}</p>
                <p><strong>رقم الهاتف:</strong> {msg.phone || '—'}</p>
                <p><strong>الرسالة:</strong> {msg.message}</p>
                <p><strong>التاريخ:</strong> {new Date(msg.created_at).toLocaleString()}</p>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

export default AdminMessages;