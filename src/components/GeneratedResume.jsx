import { useNavigate } from '@solidjs/router';
import { state } from '../store';
import { createSignal, Show, createEffect } from 'solid-js';

function GeneratedResume() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = createSignal(false);
  const [audioUrl, setAudioUrl] = createSignal('');
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [resumeData, setResumeData] = createSignal(null);

  let audio;

  createEffect(() => {
    if (state.generatedResume) {
      setResumeData(state.generatedResume);
    }
  });

  const copyContent = () => {
    navigator.clipboard.writeText(JSON.stringify(resumeData(), null, 2))
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
      const textContent = document.getElementById('resume-content').innerText;
      const result = await createEvent('text_to_speech', {
        text: textContent,
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

  const handleRecreate = () => {
    navigate('/resume-generator');
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
            class={`flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              isLoading() || isPlaying() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading() || isPlaying()}
          >
            {isLoading() ? 'جاري التحميل...' : 'استماع'}
          </button>
          <button
            onClick={handleRecreate}
            class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              isLoading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading()}
          >
            إعادة الإنشاء
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
        <Show when={resumeData()}>
          <div id="resume-content" class="mt-4 p-6 bg-white rounded-lg shadow-md">
            <h1 class="text-4xl font-bold text-center">{resumeData().name}</h1>
            <p class="text-center text-gray-600">{resumeData().jobTitle}</p>
            <div class="text-center my-4">
              <p>Email: {resumeData().contactInfo.email}</p>
              <p>Phone: {resumeData().contactInfo.phone}</p>
              <p>Address: {resumeData().contactInfo.address}</p>
            </div>
            <hr class="my-4"/>
            <section>
              <h2 class="text-2xl font-bold text-purple-600 mb-2">الملخص المهني</h2>
              <p>{resumeData().summary}</p>
            </section>
            <section>
              <h2 class="text-2xl font-bold text-purple-600 mb-2">المهارات</h2>
              <ul class="list-disc list-inside">
                <For each={resumeData().skills}>
                  {(skill) => <li>{skill}</li>}
                </For>
              </ul>
            </section>
            <section>
              <h2 class="text-2xl font-bold text-purple-600 mb-2">الخبرات العملية</h2>
              <For each={resumeData().workExperience}>
                {(work) => (
                  <div class="mb-4">
                    <h3 class="text-xl font-semibold">{work.jobTitle} at {work.company}</h3>
                    <p class="text-gray-600">{work.startDate} - {work.endDate}</p>
                    <p>{work.description}</p>
                  </div>
                )}
              </For>
            </section>
            <section>
              <h2 class="text-2xl font-bold text-purple-600 mb-2">التعليم</h2>
              <For each={resumeData().education}>
                {(edu) => (
                  <div class="mb-4">
                    <h3 class="text-xl font-semibold">{edu.degree} from {edu.institution}</h3>
                    <p class="text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    <p>{edu.description}</p>
                  </div>
                )}
              </For>
            </section>
            <Show when={resumeData().certifications && resumeData().certifications.length}>
              <section>
                <h2 class="text-2xl font-bold text-purple-600 mb-2">الشهادات</h2>
                <ul class="list-disc list-inside">
                  <For each={resumeData().certifications}>
                    {(cert) => <li>{cert}</li>}
                  </For>
                </ul>
              </section>
            </Show>
            <Show when={resumeData().languages && resumeData().languages.length}>
              <section>
                <h2 class="text-2xl font-bold text-purple-600 mb-2">اللغات</h2>
                <ul class="list-disc list-inside">
                  <For each={resumeData().languages}>
                    {(lang) => <li>{lang}</li>}
                  </For>
                </ul>
              </section>
            </Show>
            <Show when={resumeData().hobbies && resumeData().hobbies.length}>
              <section>
                <h2 class="text-2xl font-bold text-purple-600 mb-2">الهوايات والاهتمامات</h2>
                <ul class="list-disc list-inside">
                  <For each={resumeData().hobbies}>
                    {(hobby) => <li>{hobby}</li>}
                  </For>
                </ul>
              </section>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default GeneratedResume;