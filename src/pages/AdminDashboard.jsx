import { createSignal, onMount, Show } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import UserManagement from '../components/admin/UserManagement';
import BlogPostManagement from '../components/admin/BlogPostManagement';
import MessageManagement from '../components/admin/MessageManagement';
import SettingsManagement from '../components/admin/SettingsManagement';

function AdminDashboard() {
  const [user, setUser] = createSignal(null);
  const [isAdmin, setIsAdmin] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal('users');
  const navigate = useNavigate();

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
          {/* Dropdown Menu */}
          <div class="mb-6">
            <label class="block mb-2 text-lg font-semibold text-gray-700">اختر العنصر:</label>
            <select
              class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
              value={activeTab()}
              onInput={(e) => setActiveTab(e.target.value)}
            >
              <option value="users">المستخدمون</option>
              <option value="blogPosts">المقالات</option>
              <option value="messages">الرسائل</option>
              <option value="settings">الإعدادات</option>
            </select>
          </div>

          {/* Content */}
          <div class="p-6 bg-white rounded-lg shadow-lg">
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