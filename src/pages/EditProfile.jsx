import { createSignal, onMount, For } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import countries from '../data/countries';
import { useNotification } from '../components/NotificationProvider';
import Loader from '../components/Loader';
import BackButton from '../components/BackButton';

function EditProfile() {
  const navigate = useNavigate();
  const showNotification = useNotification();

  const [fullName, setFullName] = createSignal('');
  const [username, setUsername] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [phoneNumber, setPhoneNumber] = createSignal('');
  const [gender, setGender] = createSignal('');
  const [country, setCountry] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const genders = ['ذكر', 'أنثى', 'آخرى'];

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email);
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  });

  const fetchUserProfile = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/getUserProfile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setFullName(data.profile.fullName || '');
          setUsername(data.profile.username || '');
          setPhoneNumber(data.profile.phoneNumber || '');
          setGender(data.profile.gender || '');
          setCountry(data.profile.country || '');
        }
      } else {
        console.error('Error fetching profile');
        showNotification('حدث خطأ أثناء جلب الملف الشخصي', 'error');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showNotification('حدث خطأ أثناء جلب الملف الشخصي', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!fullName() || !username() || !phoneNumber() || !gender() || !country()) {
      showNotification('يرجى تعبئة جميع الحقول المطلوبة', 'error');
      return;
    }

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    try {
      const response = await fetch('/api/updateUserProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          fullName: fullName(),
          username: username(),
          phoneNumber: phoneNumber(),
          gender: gender(),
          country: country(),
        }),
      });

      if (response.ok) {
        showNotification('تم تحديث الملف الشخصي بنجاح', 'success');
        navigate('/user-account');
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء تحديث الملف الشخصي', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('حدث خطأ أثناء تحديث الملف الشخصي', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <BackButton />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">تعديل الملف الشخصي</h1>
      <div class="w-full max-w-md">
        <label class="block mb-2 text-lg font-semibold text-gray-700">الإسم الكامل<span class="text-red-500">*</span>:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          type="text"
          value={fullName()}
          onInput={(e) => setFullName(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">اسم المستخدم<span class="text-red-500">*</span>:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          type="text"
          value={username()}
          onInput={(e) => setUsername(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">البريد الإلكتروني:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          type="email"
          value={email()}
          disabled
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">رقم الهاتف<span class="text-red-500">*</span>:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          type="tel"
          value={phoneNumber()}
          onInput={(e) => setPhoneNumber(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">الجنس<span class="text-red-500">*</span>:</label>
        <select
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
          value={gender()}
          onInput={(e) => setGender(e.target.value)}
        >
          <option value="">-- اختر الجنس --</option>
          <For each={genders}>
            {(genderOption) => (
              <option value={genderOption}>{genderOption}</option>
            )}
          </For>
        </select>

        <label class="block mb-2 text-lg font-semibold text-gray-700">الدولة<span class="text-red-500">*</span>:</label>
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

        <button
          onClick={handleSubmit}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                  transition duration-300 ease-in-out transform hover:scale-105 ${
                    loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback={<Loader />}>
            حفظ التغييرات
          </Show>
        </button>
      </div>
    </div>
  );
}

export default EditProfile;