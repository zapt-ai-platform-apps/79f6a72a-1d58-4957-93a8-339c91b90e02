import { useNavigate } from '@solidjs/router';

function MainPage() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-4">Blind Accessibility</h1>
      <p class="text-center max-w-2xl text-lg leading-relaxed">
        تطبيق شامل يقدم مجموعة متنوعة من الأدوات الذكية لزيادة إمكانية الوصول وتحسين الإنتاجية للأشخاص ذوي الاحتياجات الخاصة، وخاصة المكفوفين.
      </p>
    </div>
  );
}

export default MainPage;