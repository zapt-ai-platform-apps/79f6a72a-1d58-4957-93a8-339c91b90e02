import { createSignal, onMount, For, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Loader from '../components/Loader';

function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = createSignal([]);
  const [categories] = createSignal([
    'أحدث الأخبار والمستجدات التقنية',
    'قارئات الشاشة',
    'برامج وتطبيقات',
    'حصريات',
    'دروس وشروحات',
  ]);
  const [selectedCategory, setSelectedCategory] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const query = selectedCategory() ? `?category=${encodeURIComponent(selectedCategory())}` : '';
      const response = await fetch(`/api/getBlogPosts${query}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Error fetching blog posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchPosts();
  });

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    fetchPosts();
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المدونة</h1>
      <div class="w-full max-w-md mb-6">
        <label class="block mb-2 text-lg font-semibold text-gray-700">اختر التصنيف:</label>
        <select
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
          value={selectedCategory()}
          onInput={handleCategoryChange}
        >
          <option value="">-- جميع التصنيفات --</option>
          <For each={categories()}>
            {(category) => (
              <option value={category}>{category}</option>
            )}
          </For>
        </select>
      </div>
      <Show when={loading()}>
        <Loader />
      </Show>
      <Show when={!loading() && posts().length > 0}>
        <div class="w-full max-w-md space-y-4">
          <For each={posts()}>
            {(post) => (
              <div
                class="p-4 bg-white rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <h2 class="text-2xl font-bold text-purple-600 mb-2">{post.title}</h2>
                <p class="text-gray-600 mb-2">التصنيف: {post.category}</p>
                <p class="text-gray-700">{post.content.substring(0, 100)}...</p>
              </div>
            )}
          </For>
        </div>
      </Show>
      <Show when={!loading() && posts().length === 0}>
        <p class="text-lg text-center text-gray-700">لا توجد مقالات في هذا التصنيف.</p>
      </Show>
    </div>
  );
}

export default Blog;