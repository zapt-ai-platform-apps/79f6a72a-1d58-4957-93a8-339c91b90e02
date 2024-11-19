import { supabase } from '../supabaseClient';

function Login() {
  const handleSignInWithProvider = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) console.error('Error:', error.message);
  };

  return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div class="mb-6 text-center">
          <h2 class="text-3xl font-bold mb-4 text-purple-600">تسجيل الدخول</h2>
          <p class="text-lg">
            انطلق في رحلتك الرقمية معنا! تسجيل الدخول يمنحك الوصول إلى مجموعة متنوعة من الأدوات والخدمات المبتكرة المصممة خصيصًا لتعزيز إمكانية الوصول وتحسين الإنتاجية.
          </p>
        </div>
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
        </div>
      </div>
    </div>
  );
}

export default Login;