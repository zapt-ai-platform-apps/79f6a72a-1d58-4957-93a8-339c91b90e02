import { createSignal, onMount, Show, For } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import Loader from '../components/Loader';
import { supabase } from '../supabaseClient';
import { useNotification } from '../components/NotificationProvider';

function BlogPost() {
  const navigate = useNavigate();
  const params = useParams();
  const [post, setPost] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [comments, setComments] = createSignal([]);
  const [commentContent, setCommentContent] = createSignal('');
  const [loadingComments, setLoadingComments] = createSignal(false);
  const [loadingPostComment, setLoadingPostComment] = createSignal(false);
  const [user, setUser] = createSignal(null);

  const showNotification = useNotification();

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

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetch(`/api/getComments?postId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Error fetching comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  onMount(async () => {
    fetchPost();
    fetchComments();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  });

  const handlePostComment = async () => {
    if (commentContent().trim() === '') {
      showNotification('يرجى إدخال تعليق.', 'error');
      return;
    }
    setLoadingPostComment(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/saveComment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: params.id,
          content: commentContent(),
        }),
      });
      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments()]);
        setCommentContent('');
        showNotification('تم إضافة التعليق بنجاح.', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء إضافة التعليق.', 'error');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      showNotification('حدث خطأ أثناء إضافة التعليق.', 'error');
    } finally {
      setLoadingPostComment(false);
    }
  };

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

          <hr class="my-6" />

          <h2 class="text-2xl font-bold text-purple-600 mb-4">التعليقات</h2>
          <Show when={loadingComments()}>
            <Loader />
          </Show>
          <Show when={!loadingComments() && comments().length > 0}>
            <div class="space-y-4">
              <For each={comments()}>
                {(comment) => (
                  <div class="p-4 bg-gray-100 rounded-lg">
                    <p class="text-sm text-gray-600">
                      بواسطة: {comment.userId} | {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p class="text-gray-800 mt-2 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                )}
              </For>
            </div>
          </Show>
          <Show when={!loadingComments() && comments().length === 0}>
            <p class="text-gray-600">لا توجد تعليقات بعد.</p>
          </Show>

          <Show when={user()}>
            <div class="mt-6">
              <h3 class="text-xl font-bold text-purple-600 mb-2">أضف تعليقاً</h3>
              <textarea
                class="w-full h-24 p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                placeholder="أدخل تعليقك هنا..."
                value={commentContent()}
                onInput={(e) => setCommentContent(e.target.value)}
                disabled={loadingPostComment()}
              />
              <button
                onClick={handlePostComment}
                class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
                  loadingPostComment() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                disabled={loadingPostComment()}
              >
                <Show when={!loadingPostComment()} fallback="جاري الإرسال...">
                  أرسل التعليق
                </Show>
              </button>
            </div>
          </Show>
          <Show when={!user()}>
            <p class="mt-4 text-gray-600">يرجى تسجيل الدخول لإضافة تعليق.</p>
          </Show>
        </div>
      </Show>
      <Show when={!loading() && !post()}>
        <p class="text-lg text-center text-gray-700">لم يتم العثور على المقال.</p>
      </Show>
    </div>
  );
}

export default BlogPost;