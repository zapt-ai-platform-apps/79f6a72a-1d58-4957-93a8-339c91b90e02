import { useNavigate } from '@solidjs/router';
import { createSignal, Show, onCleanup } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

function ResumeBuilder() {
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = createSignal({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [education, setEducation] = createSignal('');
  const [experience, setExperience] = createSignal('');
  const [skills, setSkills] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [resumeContent, setResumeContent] = createSignal('');

  let isMounted = true;
  onCleanup(() => {
    isMounted = false;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `
      أود منك إنشاء سيرة ذاتية احترافية باللغة العربية بناءً على المعلومات التالية:
      الاسم: ${personalInfo().name}
      البريد الإلكتروني: ${personalInfo().email}
      رقم الهاتف: ${personalInfo().phone}
      العنوان: ${personalInfo().address}
      التعليم: ${education()}
      الخبرات: ${experience()}
      المهارات: ${skills()}
      الرجاء تنسيق السيرة الذاتية بشكل جيد ومناسب.
    `;

    try {
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });

      if (isMounted) {
        setResumeContent(result || 'لم يتم الحصول على سيرة ذاتية.');
      }
    } catch (error) {
      console.error('حدث خطأ أثناء إنشاء السيرة الذاتية:', error);
      if (isMounted) {
        setResumeContent('حدث خطأ أثناء إنشاء السيرة الذاتية.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleDownload = async () => {
    if (!resumeContent()) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph({
            children: [new TextRun(resumeContent())],
          })],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'السيرة_الذاتية.docx');
  };

  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">منشئ السيرة الذاتية</h1>

      <form onSubmit={handleSubmit} class="w-full max-w-lg space-y-4">
        <div>
          <label class="block mb-1 font-semibold">الاسم الكامل</label>
          <input
            type="text"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            value={personalInfo().name}
            onInput={(e) => setPersonalInfo({ ...personalInfo(), name: e.target.value })}
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold">البريد الإلكتروني</label>
          <input
            type="email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            value={personalInfo().email}
            onInput={(e) => setPersonalInfo({ ...personalInfo(), email: e.target.value })}
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold">رقم الهاتف</label>
          <input
            type="tel"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            value={personalInfo().phone}
            onInput={(e) => setPersonalInfo({ ...personalInfo(), phone: e.target.value })}
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold">العنوان</label>
          <input
            type="text"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            value={personalInfo().address}
            onInput={(e) => setPersonalInfo({ ...personalInfo(), address: e.target.value })}
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold">التعليم</label>
          <textarea
            class="w-full p-3 h-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            value={education()}
            onInput={(e) => setEducation(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label class="block mb-1 font-semibold">الخبرات</label>
          <textarea
            class="w-full p-3 h-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            value={experience()}
            onInput={(e) => setExperience(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label class="block mb-1 font-semibold">المهارات</label>
          <textarea
            class="w-full p-3 h-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            value={skills()}
            onInput={(e) => setSkills(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback="جاري الإنشاء...">
            إنشاء السيرة الذاتية
          </Show>
        </button>
      </form>

      <Show when={resumeContent()}>
        <div class="w-full max-w-lg mt-8 p-4 bg-white rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2 text-purple-600">السيرة الذاتية:</h3>
          <p class="text-gray-700 whitespace-pre-wrap">{resumeContent()}</p>
          <button
            onClick={handleDownload}
            class="mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            تحميل
          </button>
        </div>
      </Show>
    </div>
  );
}

export default ResumeBuilder;