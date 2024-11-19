import { supabase } from '../supabaseClient';

function Login() {
  const handleSignInWithProvider = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) console.error('Error:', error.message);
  };

  return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 class="text-3xl font-bold mb-4 text-center text-purple-600">تسجيل الدخول باستخدام ZAPT</h2>
        <div class="space-y-4">
          <button
            onClick={() => handleSignInWithProvider('google')}
            class="w-full px-6 py-3 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            تسجيل الدخول باستخدام جوجل
          </button>
          <button
            onClick={() => handleSignInWithProvider('facebook')}
            class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            تسجيل الدخول باستخدام فيسبوك
          </button>
          <button
            onClick={() => handleSignInWithProvider('apple')}
            class="w-full px-6 py-3 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            تسجيل الدخول باستخدام أبل
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;