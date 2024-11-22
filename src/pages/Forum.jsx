import { createSignal, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import BackButton from '../components/BackButton';

function Forum() {
  const navigate = useNavigate();
  const [topics] = createSignal([
    { id: 1, title: 'مرحبا بكم في المنتدى', replies: 10, views: 100, lastPost: 'اليوم' },
    { id: 2, title: 'مناقشة حول إمكانية الوصول', replies: 5, views: 50, lastPost: 'أمس' },
    { id: 3, title: 'اقتراحات لتحسين التطبيق', replies: 2, views: 30, lastPost: 'قبل يومين' },
    { id: 4, title: 'أخبار وتقنيات حديثة', replies: 8, views: 80, lastPost: 'قبل ثلاثة أيام' },
  ]);

  const handleTopicClick = (id) => {
    // يمكنك إضافة التنقل إلى تفاصيل الموضوع هنا
    // navigate(`/forum/topic/${id}`);
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <BackButton />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المنتدى</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        تفاعل مع المجتمع، اطرح الأسئلة، وشارك الأفكار والمناقشات.
      </p>
      <div class="w-full max-w-3xl">
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-right text-gray-600">الموضوع</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-right text-gray-600">الردود</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-right text-gray-600">المشاهدات</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-right text-gray-600">آخر مشاركة</th>
              </tr>
            </thead>
            <tbody>
              <For each={topics()}>
                {(topic) => (
                  <tr
                    class="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTopicClick(topic.id)}
                  >
                    <td class="px-6 py-4 border-b border-gray-300">{topic.title}</td>
                    <td class="px-6 py-4 border-b border-gray-300">{topic.replies}</td>
                    <td class="px-6 py-4 border-b border-gray-300">{topic.views}</td>
                    <td class="px-6 py-4 border-b border-gray-300">{topic.lastPost}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Forum;