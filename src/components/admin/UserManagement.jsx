import { createSignal, onMount, Show, For } from 'solid-js';
import { supabase } from '../../supabaseClient';
import { useNotification } from '../NotificationProvider';
import Loader from '../Loader';

function UserManagement() {
  const [users, setUsers] = createSignal([]);
  const [loadingUsers, setLoadingUsers] = createSignal(false);
  const [loadingDelete, setLoadingDelete] = createSignal(false);
  const showNotification = useNotification();

  onMount(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getUsers', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
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

  const handleDeleteUser = async (userId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setLoadingDelete(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        showNotification('تم حذف المستخدم بنجاح.', 'success');
        setUsers(users().filter((user) => user.id !== userId));
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء حذف المستخدم.', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('حدث خطأ أثناء حذف المستخدم.', 'error');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div>
      <h2 class="text-2xl font-bold text-purple-600 mb-4">إدارة المستخدمين</h2>
      <Show when={loadingUsers()}>
        <Loader loading={loadingUsers()} />
      </Show>
      <Show when={!loadingUsers() && users().length > 0}>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="border px-4 py-2">البريد الإلكتروني</th>
                <th class="border px-4 py-2">المعرف</th>
                <th class="border px-4 py-2">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              <For each={users()}>
                {(user) => (
                  <tr>
                    <td class="border px-4 py-2">{user.email}</td>
                    <td class="border px-4 py-2">{user.id}</td>
                    <td class="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        class={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 ${
                          loadingDelete() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        disabled={loadingDelete()}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
      <Show when={!loadingUsers() && users().length === 0}>
        <p class="text-lg text-center text-gray-700">لا يوجد مستخدمون.</p>
      </Show>
    </div>
  );
}

export default UserManagement;