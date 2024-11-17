import { useNavigate } from '@solidjs/router';
import { createSignal, Show, For } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { createNotification } from '../components/Notification';

function ResumeBuilder() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();

  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [phone, setPhone] = createSignal('');
  const [address, setAddress] = createSignal('');
  const [summary, setSummary] = createSignal('');
  const [education, setEducation] = createSignal([{ degree: '', institution: '', year: '' }]);
  const [experience, setExperience] = createSignal([{ title: '', company: '', years: '', responsibilities: '' }]);
  const [skills, setSkills] = createSignal(['']);
  const [languages, setLanguages] = createSignal(['']);
  const [certifications, setCertifications] = createSignal(['']);
  const [references, setReferences] = createSignal([{ name: '', contact: '', position: '' }]);
  const [loading, setLoading] = createSignal(false);

  const handleAddEducation = () => {
    setEducation([...education(), { degree: '', institution: '', year: '' }]);
  };

  const handleRemoveEducation = (index) => {
    setEducation(education().filter((_, i) => i !== index));
  };

  const handleEducationChange = (index, key, value) => {
    const updatedEducation = [...education()];
    updatedEducation[index][key] = value;
    setEducation(updatedEducation);
  };

  const handleAddExperience = () => {
    setExperience([...experience(), { title: '', company: '', years: '', responsibilities: '' }]);
  };

  const handleRemoveExperience = (index) => {
    setExperience(experience().filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index, key, value) => {
    const updatedExperience = [...experience()];
    updatedExperience[index][key] = value;
    setExperience(updatedExperience);
  };

  const handleAddSkill = () => {
    setSkills([...skills(), '']);
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills().filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills()];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const handleAddLanguage = () => {
    setLanguages([...languages(), '']);
  };

  const handleRemoveLanguage = (index) => {
    setLanguages(languages().filter((_, i) => i !== index));
  };

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...languages()];
    updatedLanguages[index] = value;
    setLanguages(updatedLanguages);
  };

  const handleAddCertification = () => {
    setCertifications([...certifications(), '']);
  };

  const handleRemoveCertification = (index) => {
    setCertifications(certifications().filter((_, i) => i !== index));
  };

  const handleCertificationChange = (index, value) => {
    const updatedCertifications = [...certifications()];
    updatedCertifications[index] = value;
    setCertifications(updatedCertifications);
  };

  const handleAddReference = () => {
    setReferences([...references(), { name: '', contact: '', position: '' }]);
  };

  const handleRemoveReference = (index) => {
    setReferences(references().filter((_, i) => i !== index));
  };

  const handleReferenceChange = (index, key, value) => {
    const updatedReferences = [...references()];
    updatedReferences[index][key] = value;
    setReferences(updatedReferences);
  };

  const handleSubmit = async () => {
    if (!name() || !email()) {
      showNotification('يرجى تعبئة الحقول المطلوبة.', 'error');
      return;
    }
    setLoading(true);
    const prompt = `
      الرجاء إنشاء سيرة ذاتية احترافية ومُنسقة باللغة العربية باستخدام المعلومات التالية:
      
      الاسم: ${name()}
      البريد الإلكتروني: ${email()}
      الهاتف: ${phone()}
      العنوان: ${address()}
      الملخص الشخصي: ${summary()}
      
      التعليم:
      ${education().map((edu) => `- ${edu.degree} من ${edu.institution} (${edu.year})`).join('\n')}
      
      الخبرات العملية:
      ${experience().map((exp) => `- ${exp.title} في ${exp.company} لمدة ${exp.years}\nالمسؤوليات والإنجازات:\n${exp.responsibilities}`).join('\n')}
      
      المهارات:
      ${skills().join(', ')}
      
      اللغات:
      ${languages().join(', ')}
      
      الشهادات:
      ${certifications().join(', ')}
      
      المراجع:
      ${references().map((ref) => `- ${ref.name}, ${ref.position}, ${ref.contact}`).join('\n')}
      
      يجب أن تكون السيرة الذاتية مُنسقة بشكل احترافي وجاهزة للطباعة، مع التركيز على الوضوح والتنظيم.
    `;

    try {
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      navigate('/resume-result', {
        state: {
          resumeContent: result || 'لم يتم إنشاء السيرة الذاتية.',
          resumeData: {
            name: name(),
            email: email(),
            phone: phone(),
            address: address(),
            summary: summary(),
            education: education(),
            experience: experience(),
            skills: skills(),
            languages: languages(),
            certifications: certifications(),
            references: references()
          }
        },
      });
    } catch (error) {
      console.error('Error:', error);
      showNotification('حدث خطأ أثناء إنشاء السيرة الذاتية.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">منشئ السيرة الذاتية</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        قم بإنشاء سيرة ذاتية احترافية ومنسقة بسهولة عن طريق ملء النموذج التالي.
      </p>

      <div class="w-full max-w-md">
        {/* Personal Information */}
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">المعلومات الشخصية</h2>
          <label class="block mb-2 text-lg font-semibold text-gray-700">الاسم الكامل<span class="text-red-500">*</span>:</label>
          <input
            class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            type="text"
            value={name()}
            onInput={(e) => setName(e.target.value)}
          />

          <label class="block mb-2 text-lg font-semibold text-gray-700">البريد الإلكتروني<span class="text-red-500">*</span>:</label>
          <input
            class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
          />

          <label class="block mb-2 text-lg font-semibold text-gray-700">رقم الهاتف:</label>
          <input
            class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            type="tel"
            value={phone()}
            onInput={(e) => setPhone(e.target.value)}
          />

          <label class="block mb-2 text-lg font-semibold text-gray-700">العنوان:</label>
          <input
            class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            type="text"
            value={address()}
            onInput={(e) => setAddress(e.target.value)}
          />

          <label class="block mb-2 text-lg font-semibold text-gray-700">الملخص الشخصي:</label>
          <textarea
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            rows="4"
            value={summary()}
            onInput={(e) => setSummary(e.target.value)}
          />
        </div>

        {/* Education */}
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">التعليم</h2>
          <For each={education()}>
            {(edu, index) => (
              <div class="mb-4 border border-gray-300 p-4 rounded-lg relative">
                <button
                  onClick={() => handleRemoveEducation(index)}
                  class="absolute top-2 left-2 text-red-500 font-bold cursor-pointer"
                  aria-label="حذف التعليم"
                >
                  ✕
                </button>
                <label class="block mb-2 text-lg font-semibold text-gray-700">الدرجة العلمية:</label>
                <input
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={edu.degree}
                  onInput={(e) => handleEducationChange(index, 'degree', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">المؤسسة التعليمية:</label>
                <input
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={edu.institution}
                  onInput={(e) => handleEducationChange(index, 'institution', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">سنة التخرج:</label>
                <input
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={edu.year}
                  onInput={(e) => handleEducationChange(index, 'year', e.target.value)}
                />
              </div>
            )}
          </For>
          <button
            onClick={handleAddEducation}
            class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إضافة تعليم
          </button>
        </div>

        {/* Experience */}
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">الخبرات العملية</h2>
          <For each={experience()}>
            {(exp, index) => (
              <div class="mb-4 border border-gray-300 p-4 rounded-lg relative">
                <button
                  onClick={() => handleRemoveExperience(index)}
                  class="absolute top-2 left-2 text-red-500 font-bold cursor-pointer"
                  aria-label="حذف الخبرة"
                >
                  ✕
                </button>
                <label class="block mb-2 text-lg font-semibold text-gray-700">المسمى الوظيفي:</label>
                <input
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={exp.title}
                  onInput={(e) => handleExperienceChange(index, 'title', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">اسم الشركة:</label>
                <input
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={exp.company}
                  onInput={(e) => handleExperienceChange(index, 'company', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">مدة العمل:</label>
                <input
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={exp.years}
                  onInput={(e) => handleExperienceChange(index, 'years', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">المسؤوليات والإنجازات:</label>
                <textarea
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  rows="3"
                  value={exp.responsibilities}
                  onInput={(e) => handleExperienceChange(index, 'responsibilities', e.target.value)}
                />
              </div>
            )}
          </For>
          <button
            onClick={handleAddExperience}
            class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إضافة خبرة
          </button>
        </div>

        {/* Skills */}
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">المهارات</h2>
          <For each={skills()}>
            {(skill, index) => (
              <div class="mb-2 flex items-center">
                <input
                  class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={skill}
                  onInput={(e) => handleSkillChange(index, e.target.value)}
                />
                <button
                  onClick={() => handleRemoveSkill(index)}
                  class="ml-2 text-red-500 font-bold cursor-pointer"
                  aria-label="حذف المهارة"
                >
                  ✕
                </button>
              </div>
            )}
          </For>
          <button
            onClick={handleAddSkill}
            class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إضافة مهارة
          </button>
        </div>

        {/* Languages */}
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">اللغات</h2>
          <For each={languages()}>
            {(language, index) => (
              <div class="mb-2 flex items-center">
                <input
                  class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={language}
                  onInput={(e) => handleLanguageChange(index, e.target.value)}
                />
                <button
                  onClick={() => handleRemoveLanguage(index)}
                  class="ml-2 text-red-500 font-bold cursor-pointer"
                  aria-label="حذف اللغة"
                >
                  ✕
                </button>
              </div>
            )}
          </For>
          <button
            onClick={handleAddLanguage}
            class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إضافة لغة
          </button>
        </div>

        {/* Certifications */}
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">الشهادات</h2>
          <For each={certifications()}>
            {(certification, index) => (
              <div class="mb-2 flex items-center">
                <input
                  class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={certification}
                  onInput={(e) => handleCertificationChange(index, e.target.value)}
                />
                <button
                  onClick={() => handleRemoveCertification(index)}
                  class="ml-2 text-red-500 font-bold cursor-pointer"
                  aria-label="حذف الشهادة"
                >
                  ✕
                </button>
              </div>
            )}
          </For>
          <button
            onClick={handleAddCertification}
            class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إضافة شهادة
          </button>
        </div>

        {/* References */}
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">المراجع</h2>
          <For each={references()}>
            {(reference, index) => (
              <div class="mb-4 border border-gray-300 p-4 rounded-lg relative">
                <button
                  onClick={() => handleRemoveReference(index)}
                  class="absolute top-2 left-2 text-red-500 font-bold cursor-pointer"
                  aria-label="حذف المرجع"
                >
                  ✕
                </button>
                <label class="block mb-2 text-lg font-semibold text-gray-700">الاسم:</label>
                <input
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={reference.name}
                  onInput={(e) => handleReferenceChange(index, 'name', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">الوظيفة:</label>
                <input
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={reference.position}
                  onInput={(e) => handleReferenceChange(index, 'position', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">معلومات الاتصال:</label>
                <input
                  class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={reference.contact}
                  onInput={(e) => handleReferenceChange(index, 'contact', e.target.value)}
                />
              </div>
            )}
          </For>
          <button
            onClick={handleAddReference}
            class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إضافة مرجع
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
            loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback="جاري الإنشاء...">
            إنشاء السيرة الذاتية
          </Show>
        </button>
      </div>
    </div>
  );
}

export default ResumeBuilder;