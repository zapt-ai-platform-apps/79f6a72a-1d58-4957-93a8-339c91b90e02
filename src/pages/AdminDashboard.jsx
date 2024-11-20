import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);

  function isAdmin(user) {
    return user?.email === 'daoudi.abdennour@gmail.com';
  }

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (!user || !isAdmin(user)) {
      // إذا لم يكن المستخدم هو المسؤول، سيتم إعادة توجيهه إلى الصفحة الرئيسية
      navigate('/', { replace: true });
    }
  });

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-6">
        مرحبًا بك في لوحة التحكم. هنا يمكنك إدارة التطبيق، الاطلاع على الرسائل والطلبات المقدمة من المستخدمين، ومتابعة المحتوى.
      </p>
      {/* يمكنك إضافة مكونات وأقسام لوحة التحكم هنا */}
    </div>
  );
}

export default AdminDashboard;