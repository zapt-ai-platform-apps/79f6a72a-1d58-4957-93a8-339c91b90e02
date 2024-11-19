import { createSignal, onMount, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [downloading, setDownloading] = createSignal(false);

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

  const handleDownloadBackup = async () => {
    setDownloading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/downloadBackup', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        // Create a link element
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'backup.zip';
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error('Failed to download backup');
        alert('حدث خطأ أثناء تحميل النسخة الاحتياطية.');
      }
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('حدث خطأ أثناء تحميل النسخة الاحتياطية.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Show when={!loading()}>
      <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
        <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم</h1>
        <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
          مرحبًا، {user()?.user_metadata?.full_name || user()?.email} - هنا يمكنك التحكم الكامل في التطبيق.
        </p>
        {/* Admin dashboard content */}
        <div class="grid grid-cols-1 gap-4 w-full max-w-md mt-6">
          {/* Existing buttons */}
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
          {/* New Backup Download Button */}
          <button
            class={`bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${downloading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleDownloadBackup}
            disabled={downloading()}
          >
            <Show when={!downloading()} fallback="جارٍ التحميل...">
              تحميل نسخة احتياطية
            </Show>
          </button>
        </div>
      </div>
    </Show>
  );
}

export default AdminDashboard;