import { useNavigate } from '@solidjs/router';

function MainPage() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <img
        src="https://otebnzqfzytqyyjdfhzr.supabase.co/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512"
        alt="شعار تطبيق Blind Accessibility"
        class="w-32 h-32 mb-6"
      />
      <h1 class="text-4xl font-bold text-purple-600 mb-4">Blind Accessibility</h1>
      <p class="text-2xl mb-6 text-center">
        مرحبًا بك في Blind Accessibility! نحن هنا لنسهل عليك حياتك اليومية بأدوات ذكية ومبتكرة.
      </p>
      <p class="text-center max-w-2xl text-lg leading-relaxed">
        تطبيق شامل يقدم مجموعة متنوعة من الأدوات الذكية لزيادة إمكانية الوصول وتحسين الإنتاجية للأشخاص ذوي الاحتياجات الخاصة، وخاصة المكفوفين.
      </p>
    </div>
  );
}

export default MainPage;