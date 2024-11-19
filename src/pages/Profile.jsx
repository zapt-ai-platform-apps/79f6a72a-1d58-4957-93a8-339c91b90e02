import { useNavigate } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';
import { supabase } from '../supabaseClient';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  });

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
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الملف الشخصي</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        مرحبًا، {user()?.email}
      </p>
      <button
        onClick={handleSignOut}
        class="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}

export default Profile;