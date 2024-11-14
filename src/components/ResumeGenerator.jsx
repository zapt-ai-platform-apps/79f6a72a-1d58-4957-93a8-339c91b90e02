import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';
import { setState } from '../store';
import { Show } from 'solid-js';

function ResumeGenerator() {
  const navigate = useNavigate();
  const [name, setName] = createSignal('');
  const [jobTitle, setJobTitle] = createSignal('');
  const [summary, setSummary] = createSignal('');
  const [skills, setSkills] = createSignal('');
  const [workExperience, setWorkExperience] = createSignal('');
  const [education, setEducation] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleGenerateResume = async () => {
    if (!name() || !jobTitle() || !skills()) return;

    setIsLoading(true);

    try {
      const prompt = `قم بإنشاء سيرة ذاتية احترافية باللغة العربية بناءً على المعلومات التالية:
      الاسم: ${name()}
      المسمى الوظيفي: ${jobTitle()}
      الملخص المهني: ${summary()}
      المهارات: ${skills()}
      الخبرات العملية: ${workExperience()}
      التعليم: ${education()}
      `;

      const response = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });

      setState('generatedResume', response);
      setState('name', name());
      setState('jobTitle', jobTitle());
      setState('summary', summary());
      setState('skills', skills());
      setState('workExperience', workExperience());
      setState('education', education());

      navigate('/generated-resume');

    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
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
          placeholder="الاسم الكامل"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <input
          type="text"
          value={jobTitle()}
          onInput={(e) => setJobTitle(e.target.value)}
          placeholder="المسمى الوظيفي"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <textarea
          value={summary()}
          onInput={(e) => setSummary(e.target.value)}
          placeholder="الملخص المهني (اختياري)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="3"
        ></textarea>
        <textarea
          value={skills()}
          onInput={(e) => setSkills(e.target.value)}
          placeholder="المهارات (افصل بين المهارات بفاصلة)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="2"
          required
        ></textarea>
        <textarea
          value={workExperience()}
          onInput={(e) => setWorkExperience(e.target.value)}
          placeholder="الخبرات العملية (اختياري)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="4"
        ></textarea>
        <textarea
          value={education()}
          onInput={(e) => setEducation(e.target.value)}
          placeholder="التعليم (اختياري)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          rows="3"
        ></textarea>

        <button
          onClick={handleGenerateResume}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() || !name() || !jobTitle() || !skills() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading() || !name() || !jobTitle() || !skills()}
        >
          {isLoading() ? 'جاري التحميل...' : 'توليد السيرة الذاتية'}
        </button>
      </div>
    </div>
  );
}

export default ResumeGenerator;