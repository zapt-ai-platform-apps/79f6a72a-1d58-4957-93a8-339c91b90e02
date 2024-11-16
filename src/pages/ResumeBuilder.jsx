import { useNavigate } from '@solidjs/router';
import { createSignal, createEffect, Show, For, onCleanup } from 'solid-js';
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

  const [educations, setEducations] = createSignal([]);
  const [experiences, setExperiences] = createSignal([]);
  const [selectedSkills, setSelectedSkills] = createSignal([]);
  const [languages, setLanguages] = createSignal([]);
  const [hobbies, setHobbies] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [resumeContent, setResumeContent] = createSignal('');

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
    'المبيعات'
  ];

  const proficiencyLevels = ['مبتدئ', 'متوسط', 'متقدم', 'طليق', 'اللغة الأم'];

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

    const hobbiesText = hobbies();

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

        {/* قسم التعليم */}
        <div>
          <label class="block mb-1 font-semibold">التعليم</label>
          <For each={educations()}>
            {(edu, index) => (
              <div class="border p-4 mb-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold">تعليم {index() + 1}</span>
                  <button
                    type="button"
                    class="text-red-500 hover:text-red-600 cursor-pointer"
                    onClick={() => removeEducation(index())}
                  >
                    حذف
                  </button>
                </div>
                <div class="mb-2">
                  <label class="block mb-1">الدرجة العلمية</label>
                  <select
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
                    value={edu.degreeLevel}
                    onInput={(e) => updateEducation(index(), 'degreeLevel', e.target.value)}
                    required
                  >
                    <option value="">-- اختر الدرجة العلمية --</option>
                    <For each={degreeLevels}>
                      {(level) => (
                        <option value={level}>{level}</option>
                      )}
                    </For>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="block mb-1">التخصص</label>
                  <select
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
                    value={edu.fieldOfStudy}
                    onInput={(e) => updateEducation(index(), 'fieldOfStudy', e.target.value)}
                    required
                  >
                    <option value="">-- اختر التخصص --</option>
                    <For each={fieldsOfStudy}>
                      {(field) => (
                        <option value={field}>{field}</option>
                      )}
                    </For>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="block mb-1">اسم المؤسسة التعليمية</label>
                  <input
                    type="text"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    value={edu.institution}
                    onInput={(e) => updateEducation(index(), 'institution', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label class="block mb-1">سنة التخرج</label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    value={edu.graduationYear}
                    onInput={(e) => updateEducation(index(), 'graduationYear', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </For>
          <button
            type="button"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={addEducation}
          >
            إضافة تعليم
          </button>
        </div>

        {/* قسم الخبرات */}
        <div>
          <label class="block mb-1 font-semibold">الخبرات</label>
          <For each={experiences()}>
            {(exp, index) => (
              <div class="border p-4 mb-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold">خبرة {index() + 1}</span>
                  <button
                    type="button"
                    class="text-red-500 hover:text-red-600 cursor-pointer"
                    onClick={() => removeExperience(index())}
                  >
                    حذف
                  </button>
                </div>
                <div class="mb-2">
                  <label class="block mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    value={exp.jobTitle}
                    onInput={(e) => updateExperience(index(), 'jobTitle', e.target.value)}
                    required
                  />
                </div>
                <div class="mb-2">
                  <label class="block mb-1">اسم الشركة</label>
                  <input
                    type="text"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    value={exp.company}
                    onInput={(e) => updateExperience(index(), 'company', e.target.value)}
                    required
                  />
                </div>
                <div class="mb-2">
                  <label class="block mb-1">مدة العمل</label>
                  <input
                    type="text"
                    placeholder="مثلًا: من 2018 إلى 2020"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    value={exp.duration}
                    onInput={(e) => updateExperience(index(), 'duration', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label class="block mb-1">وصف المهام</label>
                  <textarea
                    class="w-full p-2 h-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    value={exp.description}
                    onInput={(e) => updateExperience(index(), 'description', e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
            )}
          </For>
          <button
            type="button"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={addExperience}
          >
            إضافة خبرة
          </button>
        </div>

        {/* قسم المهارات */}
        <div>
          <label class="block mb-1 font-semibold">المهارات</label>
          <div class="grid grid-cols-2 gap-2">
            <For each={commonSkills}>
              {(skill) => (
                <label class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSkills().includes(skill)}
                    onChange={() => toggleSkill(skill)}
                    class="cursor-pointer"
                  />
                  <span class="ml-2"> {skill}</span>
                </label>
              )}
            </For>
          </div>
        </div>

        {/* قسم اللغات */}
        <div>
          <label class="block mb-1 font-semibold">اللغات</label>
          <For each={languages()}>
            {(lang, index) => (
              <div class="border p-4 mb-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold">لغة {index() + 1}</span>
                  <button
                    type="button"
                    class="text-red-500 hover:text-red-600 cursor-pointer"
                    onClick={() => removeLanguage(index())}
                  >
                    حذف
                  </button>
                </div>
                <div class="mb-2">
                  <label class="block mb-1">اللغة</label>
                  <input
                    type="text"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    value={lang.language}
                    onInput={(e) => updateLanguage(index(), 'language', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label class="block mb-1">مستوى الإتقان</label>
                  <select
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
                    value={lang.proficiency}
                    onInput={(e) => updateLanguage(index(), 'proficiency', e.target.value)}
                    required
                  >
                    <option value="">-- اختر مستوى الإتقان --</option>
                    <For each={proficiencyLevels}>
                      {(level) => (
                        <option value={level}>{level}</option>
                      )}
                    </For>
                  </select>
                </div>
              </div>
            )}
          </For>
          <button
            type="button"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={addLanguage}
          >
            إضافة لغة
          </button>
        </div>

        {/* قسم الهوايات */}
        <div>
          <label class="block mb-1 font-semibold">الهوايات</label>
          <textarea
            class="w-full p-3 h-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            placeholder="أدخل هواياتك واهتماماتك هنا..."
            value={hobbies()}
            onInput={(e) => setHobbies(e.target.value)}
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