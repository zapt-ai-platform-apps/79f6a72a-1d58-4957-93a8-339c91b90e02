import { createSignal } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email());
      if (error) throw error;
      alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
      navigate('/login');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="h-full flex flex-col items-center justify-center p-4 text-gray-800">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">نسيت كلمة المرور</h1>
      <form onSubmit={handleResetPassword} class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
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
        <button
          type="submit"
          class={`w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading()}
        >
          {loading() ? 'جاري الإرسال...' : 'إعادة تعيين كلمة المرور'}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;