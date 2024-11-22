import { useNavigate } from '@solidjs/router';
import { createSignal, onMount, Show, For } from 'solid-js';
import { supabase } from '../supabaseClient';
import { createNotification } from '../components/Notification';
import countries from '../data/countries';
import { useSettings } from '../contexts/SettingsContext';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);

  const [name, setName] = createSignal('');
  const [gender, setGender] = createSignal('');
  const [country, setCountry] = createSignal('');
  const [phoneNumber, setPhoneNumber] = createSignal('');

  const { theme, setTheme, fontSize, setFontSize } = useSettings();

  const [loading, setLoading] = createSignal(false);

  const { NotificationComponent, showNotification } = createNotification();

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const metadata = user.user_metadata || {};
      setName(metadata.name || '');
      setGender(metadata.gender || '');
      setCountry(metadata.country || '');
      setPhoneNumber(metadata.phoneNumber || '');
      setTheme(metadata.theme || 'light');
      setFontSize(metadata.fontSize || 'medium');
    }
  });

  const handleUpdateProfile = async () => {
    setLoading(true);
    const updates = {
      name: name(),
      gender: gender(),
      country: country(),
      phoneNumber: phoneNumber(),
      theme: theme(),
      fontSize: fontSize(),
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
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('حدث خطأ أثناء تحديث الملف الشخصي.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الملف الشخصي</h1>
      <Show when={user()}>
        <div class="w-full max-w-md">
          <label class="block mb-2 text-lg font-semibold text-gray-700">الاسم:</label>
          <input
            class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            type="text"
            value={name()}
            onInput={(e) => setName(e.target.value)}
          />

          <label class="block mb-2 text-lg font-semibold text-gray-700">الجنس:</label>
          <select
            class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
            value={gender()}
            onInput={(e) => setGender(e.target.value)}
          >
            <option value="">-- اختر الجنس --</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
            <option value="آخر">آخر</option>
          </select>

          <label class="block mb-2 text-lg font-semibold text-gray-700">الدولة:</label>
          <select
            class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
            value={country()}
            onInput={(e) => setCountry(e.target.value)}
          >
            <option value="">-- اختر الدولة --</option>
            <For each={countries}>
              {(countryName) => (
                <option value={countryName}>{countryName}</option>
              )}
            </For>
          </select>

          <label class="block mb-2 text-lg font-semibold text-gray-700">رقم الهاتف:</label>
          <input
            class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            type="tel"
            value={phoneNumber()}
            onInput={(e) => setPhoneNumber(e.target.value)}
          />

          {/* قسم الإعدادات */}
          <h2 class="text-2xl font-bold text-purple-600 mb-4 mt-8">الإعدادات</h2>

          <label class="block mb-2 text-lg font-semibold text-gray-700">السمة (الثيم):</label>
          <select
            class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
            value={theme()}
            onInput={(e) => setTheme(e.target.value)}
          >
            <option value="light">فاتح</option>
            <option value="dark">داكن</option>
          </select>

          <label class="block mb-2 text-lg font-semibold text-gray-700">حجم الخط:</label>
          <select
            class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
            value={fontSize()}
            onInput={(e) => setFontSize(e.target.value)}
          >
            <option value="small">صغير</option>
            <option value="medium">متوسط</option>
            <option value="large">كبير</option>
          </select>

          <button
            onClick={handleUpdateProfile}
            class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 mb-4 ${
              loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={loading()}
          >
            <Show when={!loading()} fallback="جاري التحديث...">
              تحديث الملف الشخصي
            </Show>
          </button>

          <button
            onClick={handleSignOut}
            class="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>
      </Show>
    </div>
  );
}

export default Profile;