import { useNavigate } from '@solidjs/router';

function MainPage() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الرئيسية</h1>
      <p class="text-lg mb-4">مرحبًا بك في تطبيق أدوات Blind Accessibility.</p>
    </div>
  );
}

export default MainPage;