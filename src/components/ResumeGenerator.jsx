import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';
import { setState } from '../store';
import { Show } from 'solid-js';

function ResumeGenerator() {
  const navigate = useNavigate();
  const [name, setName] = createSignal('');
  const [jobTitle, setJobTitle] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [phone, setPhone] = createSignal('');
  const [address, setAddress] = createSignal('');
  const [summary, setSummary] = createSignal('');
  const [skills, setSkills] = createSignal('');
  const [workExperience, setWorkExperience] = createSignal('');
  const [education, setEducation] = createSignal('');
  const [certifications, setCertifications] = createSignal('');
  const [languages, setLanguages] = createSignal('');
  const [hobbies, setHobbies] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleGenerateResume = async () => {
    if (!name() || !jobTitle() || !email() || !phone() || !skills()) return;

    setIsLoading(true);

    try {
      const prompt = `قم بإنشاء سيرة ذاتية احترافية باللغة العربية بتنسيق JSON باستخدام البيانات التالية. استخدم البنية التالية:
{
  "name": "الاسم الكامل",
  "jobTitle": "المسمى الوظيفي",
  "contactInfo": {
    "email": "البريد الإلكتروني",
    "phone": "رقم الهاتف",
    "address": "العنوان"
  },
  "summary": "الملخص المهني",
  "skills": ["مهارة1", "مهارة2", ...],
  "workExperience": [
    {
      "jobTitle": "المسمى الوظيفي",
      "company": "اسم الشركة",
      "startDate": "تاريخ البدء",
      "endDate": "تاريخ الانتهاء أو 'الحالي'",
      "description": "وصف الوظيفة"
    }
  ],
  "education": [
    {
      "degree": "الشهادة",
      "institution": "المؤسسة التعليمية",
      "startDate": "تاريخ البدء",
      "endDate": "تاريخ الانتهاء أو 'الحالي'",
      "description": "وصف"
    }
  ],
  "certifications": ["شهادة1", "شهادة2"],
  "languages": ["لغة1", "لغة2"],
  "hobbies": ["هواية1", "هواية2"]
}
البيانات:
الاسم: ${name()}
المسمى الوظيفي: ${jobTitle()}
البريد الإلكتروني: ${email()}
رقم الهاتف: ${phone()}
العنوان: ${address()}
الملخص المهني: ${summary()}
المهارات: ${skills()}
الخبرات العملية: ${workExperience()}
التعليم: ${education()}
الشهادات: ${certifications()}
اللغات: ${languages()}
الهوايات والاهتمامات: ${hobbies()}
`;

      const response = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'json',
      });

      setState('generatedResume', response);
      navigate('/generated-resume');
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">منشئ السيرة الذاتية</h2>

      <div class="w-full max-w-2xl space-y-4">
        <input
          type="text"
          value={name()}
          onInput={(e) => setName(e.target.value)}
          placeholder="الاسم الكامل *"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <input
          type="text"
          value={jobTitle()}
          onInput={(e) => setJobTitle(e.target.value)}
          placeholder="المسمى الوظيفي *"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <input
          type="email"
          value={email()}
          onInput={(e) => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني *"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <input
          type="tel"
          value={phone()}
          onInput={(e) => setPhone(e.target.value)}
          placeholder="رقم الهاتف *"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <input
          type="text"
          value={address()}
          onInput={(e) => setAddress(e.target.value)}
          placeholder="العنوان"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
        />
        <textarea
          value={summary()}
          onInput={(e) => setSummary(e.target.value)}
          placeholder="الملخص المهني"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="3"
        ></textarea>
        <textarea
          value={skills()}
          onInput={(e) => setSkills(e.target.value)}
          placeholder="المهارات (افصل بين المهارات بفاصلة) *"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="2"
          required
        ></textarea>
        <textarea
          value={workExperience()}
          onInput={(e) => setWorkExperience(e.target.value)}
          placeholder="الخبرات العملية"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="4"
        ></textarea>
        <textarea
          value={education()}
          onInput={(e) => setEducation(e.target.value)}
          placeholder="التعليم"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="3"
        ></textarea>
        <textarea
          value={certifications()}
          onInput={(e) => setCertifications(e.target.value)}
          placeholder="الشهادات"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="2"
        ></textarea>
        <textarea
          value={languages()}
          onInput={(e) => setLanguages(e.target.value)}
          placeholder="اللغات (افصل بين اللغات بفاصلة)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="2"
        ></textarea>
        <textarea
          value={hobbies()}
          onInput={(e) => setHobbies(e.target.value)}
          placeholder="الهوايات والاهتمامات"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="2"
        ></textarea>

        <button
          onClick={handleGenerateResume}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            isLoading() || !name() || !jobTitle() || !email() || !phone() || !skills()
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          disabled={isLoading() || !name() || !jobTitle() || !email() || !phone() || !skills()}
        >
          {isLoading() ? 'جاري التحميل...' : 'توليد السيرة الذاتية'}
        </button>
      </div>
    </div>
  );
}

export default ResumeGenerator;