import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from 'solid-markdown';

function CVGenerator() {
  const navigate = useNavigate();
  const [name, setName] = createSignal('');
  const [contactInfo, setContactInfo] = createSignal('');
  const [objective, setObjective] = createSignal('');
  const [education, setEducation] = createSignal('');
  const [experience, setExperience] = createSignal('');
  const [skills, setSkills] = createSignal('');
  const [languages, setLanguages] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [cvContent, setCvContent] = createSignal('');
  const [downloadLink, setDownloadLink] = createSignal('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `
    قم بإنشاء سيرة ذاتية احترافية باللغة العربية باستخدام المعلومات التالية:
    - الاسم: ${name()}
    - معلومات الاتصال: ${contactInfo()}
    - الهدف الوظيفي: ${objective()}
    - التعليم: ${education()}
    - الخبرات العملية: ${experience()}
    - المهارات: ${skills()}
    - اللغات: ${languages()}
    قدم السيرة الذاتية بتنسيق Markdown.
    `;

    try {
      const response = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setCvContent(response);
      createDownloadLink(response);
    } catch (error) {
      console.error('Error generating CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDownloadLink = (content) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    setDownloadLink(url);
  };

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = downloadLink();
    link.download = 'CV.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">منشئ السيرة الذاتية بالذكاء الاصطناعي</h2>

      <form onSubmit={handleSubmit} class="w-full max-w-2xl space-y-4">
        <input
          type="text"
          placeholder="الاسم الكامل"
          value={name()}
          onInput={(e) => setName(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <input
          type="text"
          placeholder="معلومات الاتصال (البريد الإلكتروني، رقم الهاتف)"
          value={contactInfo()}
          onInput={(e) => setContactInfo(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <textarea
          placeholder="الهدف الوظيفي"
          value={objective()}
          onInput={(e) => setObjective(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="2"
        ></textarea>
        <textarea
          placeholder="التعليم (مثال: بكالوريوس في علوم الحاسوب من جامعة XYZ)"
          value={education()}
          onInput={(e) => setEducation(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="3"
        ></textarea>
        <textarea
          placeholder="الخبرات العملية (مثال: مطور ويب في شركة ABC من 2018 إلى 2020)"
          value={experience()}
          onInput={(e) => setExperience(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="4"
        ></textarea>
        <textarea
          placeholder="المهارات (مثال: JavaScript، React، Node.js)"
          value={skills()}
          onInput={(e) => setSkills(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="2"
        ></textarea>
        <textarea
          placeholder="اللغات (مثال: العربية (الأم)، الإنجليزية (متقدم))"
          value={languages()}
          onInput={(e) => setLanguages(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="2"
        ></textarea>

        <button
          type="submit"
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading()}
        >
          {loading() ? 'جاري الإنشاء...' : 'إنشاء السيرة الذاتية'}
        </button>
      </form>

      <Show when={cvContent()}>
        <div class="mt-6 w-full max-w-2xl">
          <h3 class="text-2xl font-bold text-purple-600 mb-4">السيرة الذاتية المولدة</h3>
          <div class="p-4 bg-white rounded-lg shadow-md">
            <SolidMarkdown children={cvContent()} />
          </div>
          <div class="mt-4 flex flex-wrap gap-4">
            <button
              onClick={downloadCV}
              class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              تحميل السيرة الذاتية
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default CVGenerator;