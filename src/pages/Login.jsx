import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email(),
        password: password(),
      });
      if (error) throw error;
      navigate('/');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div class="h-full flex flex-col items-center justify-center p-4 text-gray-800">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">Blind Accessibility</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        تطبيق يسهل الحياة اليومية للمكفوفين وضعاف البصر من خلال تقديم حلول مبتكرة باستخدام الذكاء الاصطناعي.
      </p>
      <button
        onClick={() => navigate('/learn-more')}
        class="mb-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      >
        معرفة المزيد
      </button>
      <form onSubmit={handleLogin} class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">اسم المستخدم أو البريد الإلكتروني:</label>
          <input
            type="email"
            required
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">كلمة المرور:</label>
          <input
            type="password"
            required
            value={password()}
            onInput={(e) => setPassword(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>
        <div class="flex items-center justify-between mb-4">
          <button
            type="submit"
            class={`px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading()}
          >
            {loading() ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            class="text-blue-500 hover:underline cursor-pointer"
          >
            نسيت كلمة المرور؟
          </button>
        </div>
        <div class="text-center">
          <button
            type="button"
            onClick={handleSignUp}
            class="text-blue-500 hover:underline cursor-pointer"
          >
            إنشاء حساب جديد
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;