import { useNavigate } from '@solidjs/router';
import { state, setState } from '../store';
import { SolidMarkdown } from 'solid-markdown';
import { createSignal, Show, createEffect } from 'solid-js';
import { createEvent } from '../supabaseClient';

function GeneratedResume() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = createSignal(false);
  const [audioUrl, setAudioUrl] = createSignal('');
  const [isPlaying, setIsPlaying] = createSignal(false);

  let audio;

  const copyContent = () => {
    navigator.clipboard.writeText(state.generatedResume)
      .then(() => {
        alert('تم نسخ السيرة الذاتية إلى الحافظة');
      })
      .catch(err => {
        console.error('Error copying content:', err);
      });
  };

  const handleListen = async () => {
    setIsLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: state.generatedResume,
      });
      setAudioUrl(result);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  createEffect(() => {
    if (audioUrl()) {
      audio = new Audio(audioUrl());
      audio.play();
      setIsPlaying(true);

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudioUrl('');
      });
    }
  });

  const handleStopAudio = () => {
    if (audio && isPlaying()) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setAudioUrl('');
    }
  };

  const handleRecreate = async () => {
    setIsLoading(true);
    try {
      const prompt = `قم بإنشاء سيرة ذاتية احترافية باللغة العربية بناءً على المعلومات التالية:
      الاسم: ${state.name}
      المسمى الوظيفي: ${state.jobTitle}
      الملخص المهني: ${state.summary}
      المهارات: ${state.skills}
      الخبرات العملية: ${state.workExperience}
      التعليم: ${state.education}
      `;

      const response = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });

      setState('generatedResume', response);
      setAudioUrl('');

    } catch (error) {
      console.error('Error regenerating resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800">
      <button
        onClick={() => navigate('/resume-generator')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>

      <h2 class="text-3xl font-bold text-purple-600 mb-6">السيرة الذاتية</h2>

      <div class="w-full max-w-2xl space-y-4">
        <div class="flex flex-wrap gap-4">
          <button
            onClick={copyContent}
            class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            نسخ السيرة الذاتية
          </button>
          <button
            onClick={handleListen}
            class={`flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() || isPlaying() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading() || isPlaying()}
          >
            {isLoading() ? 'جاري التحميل...' : 'استماع'}
          </button>
          <button
            onClick={handleRecreate}
            class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading()}
          >
            {isLoading() ? 'جاري التحميل...' : 'إعادة الإنشاء'}
          </button>
          <Show when={isPlaying()}>
            <button
              onClick={handleStopAudio}
              class="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              إيقاف الصوت
            </button>
          </Show>
        </div>
        <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
          <SolidMarkdown class="prose prose-lg text-gray-700" children={state.generatedResume} />
        </div>
      </div>
    </div>
  );
}

export default GeneratedResume;