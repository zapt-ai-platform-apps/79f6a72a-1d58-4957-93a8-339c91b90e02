import { createSignal, onMount, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user?.email !== 'daoudi.abdennour@gmail.com') {
      // If not admin, redirect to home page
      navigate('/', { replace: true });
    } else {
      setLoading(false);
    }
  });

  return (
    <Show when={!loading()}>
      <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
        <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم</h1>
        <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
          مرحبًا، {user()?.user_metadata?.full_name || user()?.email} - هنا يمكنك التحكم الكامل في التطبيق.
        </p>
        {/* Admin dashboard content */}
        <div class="grid grid-cols-1 gap-4 w-full max-w-md mt-6">
          {/* Update button to navigate to AdminMessages */}
          <button
            class="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => navigate('/admin/users')}
          >
            إدارة المستخدمين
          </button>
          <button
            class="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => navigate('/admin/messages')}
          >
            عرض الرسائل
          </button>
          <button
            class="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => navigate('/admin/statistics')}
          >
            إحصائيات الاستخدام
          </button>
          {/* More features can be added */}
        </div>
      </div>
    </Show>
  );
}

export default AdminDashboard;