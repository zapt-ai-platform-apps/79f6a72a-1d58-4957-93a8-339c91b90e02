import { useNavigate } from '@solidjs/router';

function Service() {
  const navigate = useNavigate();

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الخدمات</h1>
      <p class="text-lg mb-4 text-justify leading-relaxed max-w-2xl">
        يقدم تطبيق <strong>Blind Accessibility</strong> مجموعة واسعة من الخدمات المصممة خصيصًا لتحسين تجربة المستخدمين ذوي الاحتياجات الخاصة، وخصوصًا المكفوفين. نسعى من خلال تطبيقنا إلى توفير أدوات ذكية ومبتكرة تمكن المستخدمين من التفاعل مع التكنولوجيا بسهولة ويسر.
      </p>
      <p class="text-lg mb-4 text-justify leading-relaxed max-w-2xl">
        تشمل خدماتنا دعمًا فنيًا مخصصًا لمساعدة المستخدمين في أي مشكلات قد يواجهونها أثناء استخدام التطبيق. كما نوفر موارد تعليمية وشروحات تفصيلية عن كيفية استخدام كل أداة من الأدوات المتاحة.
      </p>
      <p class="text-lg mb-4 text-justify leading-relaxed max-w-2xl">
        نحن ملتزمون بتطوير وتحسين خدماتنا باستمرار، ونسعد بتلقي اقتراحاتكم وملاحظاتكم. تواصلوا معنا عبر البريد الإلكتروني أو الهاتف، لنتمكن من تقديم أفضل تجربة ممكنة لكم.
      </p>
      <p class="text-lg mb-4 text-justify leading-relaxed max-w-2xl">
        شكرًا لاختياركم <strong>Blind Accessibility</strong> كشريك لكم في تعزيز إمكانية الوصول والتفاعل مع العالم الرقمي.
      </p>
    </div>
  );
}

export default Service;