import { onMount, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { state } from '../store';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from 'solid-markdown';

function GeneratedResume() {
  const [loading, setLoading] = createSignal(true);
  const navigate = useNavigate();

  onMount(async () => {
    try {
      const prompt = `
        قم بإنشاء سيرة ذاتية احترافية باللغة العربية بناءً على المعلومات التالية:
        الاسم: ${state.name}
        المسمى الوظيفي: ${state.jobTitle}
        البريد الإلكتروني: ${state.email}
        الهاتف: ${state.phone}
        العنوان: ${state.address}
        الملخص: ${state.summary}
        المهارات: ${state.skills}
        الخبرة العملية: ${state.workExperience}
        التعليم: ${state.education}
        الشهادات: ${state.certifications}
        اللغات: ${state.languages}
        الهوايات: ${state.hobbies}
      `;
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setState('generatedResume', result);
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setLoading(false);
    }
  });

  const copyText = () => {
    navigator.clipboard.writeText(state.generatedResume)
      .then(() => {
        alert('تم نسخ النص إلى الحافظة');
      })
      .catch(err => {
        console.error('Error copying text:', err);
      });
  };

  const listenText = async () => {
    try {
      const audioUrl = await createEvent('text_to_speech', {
        text: state.generatedResume,
      });
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  const regenerateResume = async () => {
    setLoading(true);
    try {
      const prompt = `
        قم بإنشاء سيرة ذاتية مختلفة بناءً على المعلومات التالية:
        الاسم: ${state.name}
        المسمى الوظيفي: ${state.jobTitle}
        البريد الإلكتروني: ${state.email}
        الهاتف: ${state.phone}
        العنوان: ${state.address}
        الملخص: ${state.summary}
        المهارات: ${state.skills}
        الخبرة العملية: ${state.workExperience}
        التعليم: ${state.education}
        الشهادات: ${state.certifications}
        اللغات: ${state.languages}
        الهوايات: ${state.hobbies}
      `;
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setState('generatedResume', result);
    } catch (error) {
      console.error('Error regenerating resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pb-16">
      <button
        onClick={() => navigate('/resume-generator')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      {loading() ? (
        <p>جاري إنشاء السيرة الذاتية...</p>
      ) : (
        <>
          <h2 class="text-3xl font-bold text-purple-600 mb-6">السيرة الذاتية المولدة</h2>
          <div class="prose prose-lg text-gray-700 bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
            <SolidMarkdown children={state.generatedResume} />
          </div>
          <div class="flex gap-4 mt-4">
            <button
              onClick={copyText}
              class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              نسخ النص
            </button>
            <button
              onClick={listenText}
              class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              استماع
            </button>
            <button
              onClick={regenerateResume}
              class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              إعادة إنشاء
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GeneratedResume;