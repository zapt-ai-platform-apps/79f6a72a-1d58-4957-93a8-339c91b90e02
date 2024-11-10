import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import { saveAs } from 'file-saver';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await generateWordDocument();
    } catch (error) {
      console.error('Error generating CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWordDocument = async () => {
    const doc = new Document();

    doc.addSection({
      children: [
        new Paragraph({
          text: name(),
          heading: HeadingLevel.TITLE,
          alignment: 'center',
        }),
        new Paragraph({
          text: contactInfo(),
          alignment: 'center',
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'الهدف الوظيفي',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(objective()),
        new Paragraph({
          text: 'التعليم',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(education()),
        new Paragraph({
          text: 'الخبرات العملية',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(experience()),
        new Paragraph({
          text: 'المهارات',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(skills()),
        new Paragraph({
          text: 'اللغات',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(languages()),
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'CV.docx');
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
    </div>
  );
}

export default CVGenerator;