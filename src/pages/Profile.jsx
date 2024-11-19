import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount, Show } from 'solid-js';
import { createNotification } from '../components/Notification';

function Profile() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();
  const [user, setUser] = createSignal(null);
  const [name, setName] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setName(user.user_metadata?.name || '');
    } else {
      navigate('/');
    }
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    if (name().trim() === '') {
      showNotification('يرجى إدخال الاسم.', 'error');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: name(),
        },
      });
      if (error) {
        throw error;
      }
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      showNotification('تم تحديث الملف الشخصي بنجاح.', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('حدث خطأ أثناء تحديث الملف الشخصي.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الملف الشخصي</h1>
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">الاسم:</label>
          <input
            type="text"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            value={name()}
            onInput={(e) => setName(e.target.value)}
          />
        </div>
        <p class="text-lg mb-4">البريد الإلكتروني: {user()?.email}</p>
        <button
          onClick={handleUpdateProfile}
          class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback="جاري التحديث...">
            تحديث الملف الشخصي
          </Show>
        </button>
        <button
          onClick={handleSignOut}
          class="mt-4 w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

export default Profile;