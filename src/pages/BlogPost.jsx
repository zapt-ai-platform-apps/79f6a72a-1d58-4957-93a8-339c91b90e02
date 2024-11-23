import { createSignal, onMount, Show } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import Loader from '../components/Loader';

function BlogPost() {
  const navigate = useNavigate();
  const params = useParams();
  const [post, setPost] = createSignal(null);
  const [loading, setLoading] = createSignal(false);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getBlogPosts?id=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data[0]);
      } else {
        console.error('Error fetching blog post');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchPost();
  });

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <Show when={loading()}>
        <Loader />
      </Show>
      <Show when={!loading() && post()}>
        <div class="w-full max-w-md">
          <h1 class="text-4xl font-bold text-purple-600 mb-4">{post().title}</h1>
          <p class="text-gray-600 mb-4">التصنيف: {post().category}</p>
          <div class="text-gray-800 whitespace-pre-wrap">{post().content}</div>
        </div>
      </Show>
      <Show when={!loading() && !post()}>
        <p class="text-lg text-center text-gray-700">لم يتم العثور على المقال.</p>
      </Show>
    </div>
  );
}

export default BlogPost;