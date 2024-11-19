import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    } else {
      navigate('/');
    }
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الملف الشخصي</h1>
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <p class="text-lg mb-4">البريد الإلكتروني: {user()?.email}</p>
        <button
          onClick={handleSignOut}
          class="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

export default Profile;