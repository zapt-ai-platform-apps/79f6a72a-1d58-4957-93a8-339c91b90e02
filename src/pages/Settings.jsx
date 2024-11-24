import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNotification } from '../components/NotificationProvider';
import Loader from '../components/Loader';

function Settings() {
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = createSignal(false);
  const [newPassword, setNewPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const showNotification = useNotification();

  const handlePasswordUpdate = async () => {
    if (newPassword() !== confirmPassword()) {
      showNotification('🛑 كلمة المرور غير متطابقة', 'error');
      return;
    }
    if (newPassword().length < 6) {
      showNotification('🛑 يجب أن تكون كلمة المرور 6 أحرف على الأقل', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword(),
      });

      if (error) {
        console.error('Error updating password:', error);
        showNotification('حدث خطأ أثناء تحديث كلمة المرور', 'error');
      } else {
        showNotification('✅ تم تحديث كلمة المرور بنجاح', 'success');
        setShowPasswordForm(false);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('حدث خطأ أثناء تحديث كلمة المرور', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الإعدادات</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        هنا يمكنك تعديل إعدادات التطبيق لتناسب احتياجاتك.
      </p>

      <div class="w-full max-w-md">
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm())}
          class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-4 cursor-pointer"
        >
          تغيير كلمة المرور
        </button>

        <Show when={showPasswordForm()}>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <label class="block mb-2 text-lg font-semibold text-gray-700">كلمة المرور الجديدة:</label>
            <input
              type="password"
              class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              value={newPassword()}
              onInput={(e) => setNewPassword(e.target.value)}
            />

            <label class="block mb-2 text-lg font-semibold text-gray-700">تأكيد كلمة المرور:</label>
            <input
              type="password"
              class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={handlePasswordUpdate}
              class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-4 ${
                loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              disabled={loading()}
            >
              <Show when={!loading()} fallback={<Loader />}>
                حفظ كلمة المرور
              </Show>
            </button>

            <button
              onClick={() => {
                setShowPasswordForm(false);
                setNewPassword('');
                setConfirmPassword('');
              }}
              class="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default Settings;