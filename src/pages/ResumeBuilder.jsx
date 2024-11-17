import { useNavigate } from '@solidjs/router';
import { createSignal, Show, For, onCleanup } from 'solid-js';
import { createEvent } from '../supabaseClient';

function ResumeBuilder() {
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = createSignal({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [educations, setEducations] = createSignal([]);
  const [experiences, setExperiences] = createSignal([]);
  const [selectedSkills, setSelectedSkills] = createSignal([]);
  const [languages, setLanguages] = createSignal([]);
  const [selectedHobbies, setSelectedHobbies] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  let isMounted = true;
  onCleanup(() => {
    isMounted = false;
  });

  const degreeLevels = ['بكالوريوس', 'ماجستير', 'دكتوراه', 'دبلوم', 'ثانوية'];
  const fieldsOfStudy = ['هندسة', 'علوم الحاسوب', 'إدارة الأعمال', 'الطب', 'الصيدلة', 'الحقوق', 'التسويق', 'التصميم', 'تعليم', 'أخرى'];

  const commonSkills = [
    'العمل الجماعي',
    'الاتصال',
    'حل المشكلات',
    'إدارة الوقت',
    'القيادة',
    'الإبداع',
    'المرونة',
    'الاهتمام بالتفاصيل',
    'البرمجة',
    'إدارة المشاريع',
    'التسويق',
    'المبيعات',
  ];

  const proficiencyLevels = ['مبتدئ', 'متوسط', 'متقدم', 'طليق', 'اللغة الأم'];

  const commonHobbies = [
    'القراءة',
    'الكتابة',
    'الرياضة',
    'السفر',
    'الرسم',
    'التصوير',
    'الموسيقى',
    'الطبخ',
    'المسرح',
    'التطوع',
  ];

  const addEducation = () => {
    setEducations([...educations(), { degreeLevel: '', fieldOfStudy: '', institution: '', graduationYear: '' }]);
  };

  const removeEducation = (index) => {
    setEducations(educations().filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...educations()];
    updated[index][field] = value;
    setEducations(updated);
  };

  const addExperience = () => {
    setExperiences([...experiences(), { jobTitle: '', company: '', duration: '', description: '' }]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences().filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experiences()];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const addLanguage = () => {
    setLanguages([...languages(), { language: '', proficiency: '' }]);
  };

  const removeLanguage = (index) => {
    setLanguages(languages().filter((_, i) => i !== index));
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...languages()];
    updated[index][field] = value;
    setLanguages(updated);
  };

  const toggleSkill = (skill) => {
    if (selectedSkills().includes(skill)) {
      setSelectedSkills(selectedSkills().filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills(), skill]);
    }
  };

  const toggleHobby = (hobby) => {
    if (selectedHobbies().includes(hobby)) {
      setSelectedHobbies(selectedHobbies().filter(h => h !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies(), hobby]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const educationText = educations().map((edu, index) => `
      التعليم ${index + 1}:
      الدرجة العلمية: ${edu.degreeLevel}
      التخصص: ${edu.fieldOfStudy}
      المؤسسة التعليمية: ${edu.institution}
      سنة التخرج: ${edu.graduationYear}
    `).join('\n');

    const experienceText = experiences().map((exp, index) => `
      الخبرة ${index + 1}:
      المسمى الوظيفي: ${exp.jobTitle}
      الشركة: ${exp.company}
      المدة: ${exp.duration}
      الوصف: ${exp.description}
    `).join('\n');

    const languagesText = languages().map((lang, index) => `
      اللغة ${index + 1}:
      اللغة: ${lang.language}
      مستوى الإتقان: ${lang.proficiency}
    `).join('\n');

    const skillsText = selectedSkills().join(', ');

    const hobbiesText = selectedHobbies().join(', ');

    const prompt = `
      أود منك إنشاء سيرة ذاتية احترافية باللغة العربية بناءً على المعلومات التالية:
      الاسم: ${personalInfo().name}
      البريد الإلكتروني: ${personalInfo().email}
      رقم الهاتف: ${personalInfo().phone}
      العنوان: ${personalInfo().address}
      التعليم:
      ${educationText}
      الخبرات:
      ${experienceText}
      المهارات: ${skillsText}
      اللغات:
      ${languagesText}
      الهوايات:
      ${hobbiesText}
      الرجاء تنسيق السيرة الذاتية بشكل جيد ومناسب.
    `;

    try {
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });

      if (isMounted) {
        setLoading(false);
        navigate('/resume-result', {
          state: {
            resumeContent: result || 'لم يتم الحصول على سيرة ذاتية.',
          },
        });
      }
    } catch (error) {
      console.error('حدث خطأ أثناء إنشاء السيرة الذاتية:', error);
      if (isMounted) {
        setLoading(false);
        navigate('/resume-result', {
          state: {
            resumeContent: 'حدث خطأ أثناء إنشاء السيرة الذاتية.',
          },
        });
      }
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">منشئ السيرة الذاتية</h1>

      <form onSubmit={handleSubmit} class="w-full max-w-lg space-y-4">
        {/* معلومات شخصية */}
        <div>
          <h2 class="text-2xl font-semibold mb-2 text-purple-600">المعلومات الشخصية</h2>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">الاسم الكامل</label>
            <input
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              placeholder="أدخل اسمك الكامل"
              required
              value={personalInfo().name}
              onInput={(e) => setPersonalInfo({ ...personalInfo(), name: e.target.value })}
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              placeholder="أدخل بريدك الإلكتروني"
              required
              value={personalInfo().email}
              onInput={(e) => setPersonalInfo({ ...personalInfo(), email: e.target.value })}
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">رقم الهاتف</label>
            <input
              type="tel"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              placeholder="أدخل رقم هاتفك"
              required
              value={personalInfo().phone}
              onInput={(e) => setPersonalInfo({ ...personalInfo(), phone: e.target.value })}
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">العنوان</label>
            <input
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              placeholder="أدخل عنوانك"
              required
              value={personalInfo().address}
              onInput={(e) => setPersonalInfo({ ...personalInfo(), address: e.target.value })}
            />
          </div>
        </div>
        {/* ... باقي النموذج (التعليم، الخبرات، المهارات، اللغات، الهوايات) ... */}
        {/* زر الإرسال */}
        <button
          type="submit"
          class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={loading()}
        >
          <Show when={!loading()} fallback="جاري الإنشاء...">
            إنشاء السيرة الذاتية
          </Show>
        </button>
      </form>
    </div>
  );
}

export default ResumeBuilder;