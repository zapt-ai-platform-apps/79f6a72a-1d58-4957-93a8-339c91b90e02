import { createSignal, onMount, For, Show } from 'solid-js';
import { createNotification } from '../components/Notification';
import Loader from '../components/Loader';

function Blog() {
  const { NotificationComponent, showNotification } = createNotification();
  const [blogPosts, setBlogPosts] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getBlogPosts');
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data);
      } else {
        showNotification('حدث خطأ أثناء جلب المقالات.', 'error');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      showNotification('حدث خطأ أثناء جلب المقالات.', 'error');
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchBlogPosts();
  });

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المدونة</h1>
      <Show when={!loading()} fallback={<Loader />}>
        <Show when={blogPosts().length > 0} fallback={<p class="text-center">لا توجد مقالات.</p>}>
          <div class="w-full max-w-4xl">
            <For each={blogPosts()}>
              {(post) => (
                <div class="mb-6 p-6 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  <h2 class="text-2xl font-bold mb-2">{post.title}</h2>
                  <p class="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  <p class="text-sm text-gray-500 mt-2">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default Blog;