import { useNavigate } from '@solidjs/router';
import { createSignal, onMount, Show } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNotification } from '../components/NotificationProvider';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);

  const [username, setUsername] = createSignal('');
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [bio, setBio] = createSignal('');
  const [gender, setGender] = createSignal('');
  const [country, setCountry] = createSignal('');
  const [phoneNumber, setPhoneNumber] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [editing, setEditing] = createSignal(false);

  const showNotification = useNotification();

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const metadata = user.user_metadata || {};
      setUsername(metadata.username || '');
      setName(metadata.name || '');
      setEmail(user.email || '');
      setBio(metadata.bio || '');
      setGender(metadata.gender || '');
      setCountry(metadata.country || '');
      setPhoneNumber(metadata.phoneNumber || '');
    }
  });

  const handleUpdateProfile = async () => {
    setLoading(true);
    const updates = {
      username: username(),
      name: name(),
      bio: bio(),
      gender: gender(),
      country: country(),
      phoneNumber: phoneNumber(),
    };

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        showNotification('حدث خطأ أثناء تحديث الملف الشخصي.', 'error');
        console.error(error);
      } else {
        showNotification('تم تحديث الملف الشخصي بنجاح.', 'success');
        setUser(data.user);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('حدث خطأ أثناء تحديث الملف الشخصي.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    const metadata = user().user_metadata || {};
    setUsername(metadata.username || '');
    setName(metadata.name || '');
    setEmail(user().email || '');
    setBio(metadata.bio || '');
    setGender(metadata.gender || '');
    setCountry(metadata.country || '');
    setPhoneNumber(metadata.phoneNumber || '');
    setEditing(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <Show when={user()}>
        <h1 class="text-4xl font-bold text-purple-600 mb-6">مرحبًا!</h1>
        <div class="w-full max-w-md">
          <Show when={!editing()} fallback={
            <>
              {/* نموذج تعديل الملف الشخصي */}
              <div class="mb-4">
                <label class="block mb-2 text-lg font-semibold text-gray-700">الاسم الكامل:</label>
                <input
                  class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={name()}
                  onInput={(e) => setName(e.target.value)}
                />
              </div>
              {/* باقي عناصر النموذج */}
              <div class="flex space-x-4">
                <button
                  onClick={handleUpdateProfile}
                  class={`flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 mb-4 ${
                    loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  disabled={loading()}
                >
                  <Show when={!loading()} fallback="جاري التحديث...">
                    حفظ التغييرات
                  </Show>
                </button>
                <button
                  onClick={handleCancelEdit}
                  class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 mb-4 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </>
          }>
            <button
              onClick={() => setEditing(true)}
              class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-4 cursor-pointer"
            >
              تعديل الملف الشخصي
            </button>

            <button
              onClick={() => navigate('/messages')}
              class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-4 cursor-pointer"
            >
              الرسائل
            </button>

            <button
              onClick={() => navigate('/settings')}
              class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-4 cursor-pointer"
            >
              الإعدادات
            </button>

            <button
              onClick={handleSignOut}
              class="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              تسجيل الخروج
            </button>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default Profile;