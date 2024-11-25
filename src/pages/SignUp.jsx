import { createSignal, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';
import { useNotification } from '../components/NotificationProvider';
import countries from '../data/countries';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [fullName, setFullName] = createSignal('');
  const [username, setUsername] = createSignal('');
  const [phoneNumber, setPhoneNumber] = createSignal('');
  const [gender, setGender] = createSignal('');
  const [country, setCountry] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const showNotification = useNotification();

  const genders = ['ذكر', 'أنثى', 'آخرى'];

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!fullName() || !username() || !phoneNumber() || !gender() || !country()) {
      showNotification('يرجى تعبئة جميع الحقول المطلوبة', 'error');
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email(),
        password: password(),
      });
      if (error) throw error;

      // Attempt to sign in the user immediately
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email(),
        password: password(),
      });
      if (loginError) {
        // If sign-in fails, prompt user to verify email
        showNotification('تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني.', 'success');
        navigate('/login');
        return;
      }

      // Update user profile
      const { data: { session } } = await supabase.auth.getSession();
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
        showNotification('تم إنشاء الحساب وتعبئة الملف الشخصي بنجاح', 'success');
        navigate('/');
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء إنشاء الملف الشخصي', 'error');
        navigate('/login');
      }
    } catch (error) {
      showNotification(error.error_description || error.message || 'حدث خطأ أثناء إنشاء الحساب', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center justify-center p-4 text-gray-800">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">إنشاء حساب جديد</h1>
      <form onSubmit={handleSignUp} class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">الإسم الكامل<span class="text-red-500">*</span>:</label>
          <input
            type="text"
            required
            value={fullName()}
            onInput={(e) => setFullName(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">اسم المستخدم<span class="text-red-500">*</span>:</label>
          <input
            type="text"
            required
            value={username()}
            onInput={(e) => setUsername(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">رقم الهاتف<span class="text-red-500">*</span>:</label>
          <input
            type="tel"
            required
            value={phoneNumber()}
            onInput={(e) => setPhoneNumber(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">الجنس<span class="text-red-500">*</span>:</label>
          <select
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
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
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">الدولة<span class="text-red-500">*</span>:</label>
          <select
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
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
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">البريد الإلكتروني:</label>
          <input
            type="email"
            required
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>
        <div class="mb-6">
          <label class="block mb-2 text-lg font-semibold text-gray-700">كلمة المرور:</label>
          <input
            type="password"
            required
            value={password()}
            onInput={(e) => setPassword(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>
        <button
          type="submit"
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback="جاري إنشاء الحساب...">
            إنشاء حساب جديد
          </Show>
        </button>
      </form>
    </div>
  );
}

export default SignUp;