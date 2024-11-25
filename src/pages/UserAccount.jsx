import { createSignal, onMount } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import BackButton from '../components/BackButton';

function UserAccount() {
  const [user, setUser] = createSignal(null);
  const [profile, setProfile] = createSignal(null);
  const navigate = useNavigate();

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  });

  const fetchUserProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/getUserProfile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        console.error('Error fetching profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <BackButton />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">حساب المستخدم</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        مرحبًا {user()?.email}، يمكنك هنا إدارة حسابك.
      </p>

      <div class="w-full max-w-md">
        <p class="mb-4"><strong>البريد الإلكتروني:</strong> {user()?.email}</p>
        <p class="mb-4"><strong>الاسم الكامل:</strong> {profile()?.fullName || 'غير متوفر'}</p>
        <p class="mb-4"><strong>اسم المستخدم:</strong> {profile()?.username || 'غير متوفر'}</p>
        <p class="mb-4"><strong>رقم الهاتف:</strong> {profile()?.phoneNumber || 'غير متوفر'}</p>
        <p class="mb-4"><strong>الجنس:</strong> {profile()?.gender || 'غير متوفر'}</p>
        <p class="mb-4"><strong>الدولة:</strong> {profile()?.country || 'غير متوفر'}</p>
        <button
          onClick={handleEditProfile}
          class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mb-4"
        >
          تعديل الملف الشخصي
        </button>
        <button
          onClick={() => navigate('/settings')}
          class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mb-4"
        >
          تعديل الإعدادات
        </button>
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

export default UserAccount;