import { createSignal, onMount, Show } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import Loader from '../components/Loader';
import { useNotification } from '../components/NotificationProvider';
import UserManagement from '../components/admin/UserManagement';
import BlogPostManagement from '../components/admin/BlogPostManagement';
import MessageManagement from '../components/admin/MessageManagement';
import SettingsManagement from '../components/admin/SettingsManagement';

function AdminDashboard() {
  const [user, setUser] = createSignal(null);
  const [isAdmin, setIsAdmin] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal('users');
  const navigate = useNavigate();
  const showNotification = useNotification();

  onMount(async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user && user.email === 'daoudi.abdennour@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  });

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
      >
        🔙
      </button>
      <Show when={isAdmin()} fallback={<p class="text-lg text-center text-gray-700">ليس لديك صلاحية الوصول إلى هذه الصفحة.</p>}>
        <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم الإدارية</h1>
        <div class="w-full max-w-6xl">
          {/* Tabs */}
          <div class="flex mb-6 space-x-reverse space-x-4">
            <button
              class={`px-4 py-2 rounded-t-lg ${activeTab() === 'users' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
              onClick={() => setActiveTab('users')}
            >
              المستخدمون
            </button>
            <button
              class={`px-4 py-2 rounded-t-lg ${activeTab() === 'blogPosts' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
              onClick={() => setActiveTab('blogPosts')}
            >
              المقالات
            </button>
            <button
              class={`px-4 py-2 rounded-t-lg ${activeTab() === 'messages' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
              onClick={() => setActiveTab('messages')}
            >
              الرسائل
            </button>
            <button
              class={`px-4 py-2 rounded-t-lg ${activeTab() === 'settings' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
              onClick={() => setActiveTab('settings')}
            >
              الإعدادات
            </button>
          </div>

          {/* Content */}
          <div class="p-6 bg-white rounded-b-lg shadow-lg">
            <Show when={activeTab() === 'users'}>
              <UserManagement />
            </Show>
            <Show when={activeTab() === 'blogPosts'}>
              <BlogPostManagement />
            </Show>
            <Show when={activeTab() === 'messages'}>
              <MessageManagement />
            </Show>
            <Show when={activeTab() === 'settings'}>
              <SettingsManagement />
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default AdminDashboard;