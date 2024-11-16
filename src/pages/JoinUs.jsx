import { useNavigate } from '@solidjs/router';

function JoinUs() {
  const navigate = useNavigate();

  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">انضم إلى فريقنا</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-6">
        نحن نبحث عن أفراد موهوبين وشغوفين للانضمام إلى فريقنا والمساهمة في تحسين إمكانية الوصول للجميع.
        إذا كنت ترغب في المشاركة والتميز، يرجى ملء النموذج أدناه للتواصل معنا.
      </p>
      <form class="w-full max-w-md">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">الاسم الكامل</label>
          <input
            type="text"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            placeholder="أدخل اسمك الكامل"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            placeholder="أدخل بريدك الإلكتروني"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">رسالة</label>
          <textarea
            class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            placeholder="أخبرنا عن نفسك ولماذا ترغب في الانضمام"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          إرسال
        </button>
      </form>
    </div>
  );
}

export default JoinUs;