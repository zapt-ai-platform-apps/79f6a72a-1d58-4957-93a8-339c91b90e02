import { createSignal, onMount, Show, For } from 'solid-js';
import { supabase } from '../../supabaseClient';
import { useNotification } from '../NotificationProvider';
import Loader from '../Loader';

function BlogPostManagement() {
  const [posts, setPosts] = createSignal([]);
  const [loadingPosts, setLoadingPosts] = createSignal(false);
  const [loadingDelete, setLoadingDelete] = createSignal(false);
  const [editingPost, setEditingPost] = createSignal(null);
  const [editTitle, setEditTitle] = createSignal('');
  const [editContent, setEditContent] = createSignal('');
  const [editCategory, setEditCategory] = createSignal('');
  const [loadingSave, setLoadingSave] = createSignal(false);
  const [isAddingNew, setIsAddingNew] = createSignal(false);
  const showNotification = useNotification();

  onMount(() => {
    fetchPosts();
  });

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch('/api/getBlogPosts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        console.error('Error fetching blog posts');
        showNotification('حدث خطأ أثناء جلب المقالات.', 'error');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      showNotification('حدث خطأ أثناء جلب المقالات.', 'error');
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setLoadingDelete(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/deleteBlogPost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });
      if (response.ok) {
        showNotification('تم حذف المقال بنجاح.', 'success');
        setPosts(posts().filter((post) => post.id !== postId));
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء حذف المقال.', 'error');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      showNotification('حدث خطأ أثناء حذف المقال.', 'error');
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    setIsAddingNew(false);
  };

  const handleAddNewPost = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
    setIsAddingNew(true);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
    setIsAddingNew(false);
  };

  const handleSavePost = async () => {
    if (!editTitle() || !editContent() || !editCategory()) {
      showNotification('يرجى تعبئة الحقول المطلوبة.', 'error');
      return;
    }
    setLoadingSave(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let response;

      if (isAddingNew()) {
        // Save new post
        response = await fetch('/api/saveBlogPost', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editTitle(),
            content: editContent(),
            category: editCategory(),
          }),
        });
        if (response.ok) {
          showNotification('تم إضافة المقال بنجاح.', 'success');
          // Fetch posts again to include the new one
          fetchPosts();
          handleCancelEdit();
        } else {
          const errorData = await response.json();
          showNotification(errorData.error || 'حدث خطأ أثناء إضافة المقال.', 'error');
        }
      } else {
        // Update existing post
        response = await fetch('/api/updateBlogPost', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: editingPost().id,
            title: editTitle(),
            content: editContent(),
            category: editCategory(),
          }),
        });
        if (response.ok) {
          showNotification('تم تحديث المقال بنجاح.', 'success');
          setPosts(posts().map((post) => (post.id === editingPost().id ? { ...post, title: editTitle(), content: editContent(), category: editCategory() } : post)));
          handleCancelEdit();
        } else {
          const errorData = await response.json();
          showNotification(errorData.error || 'حدث خطأ أثناء تحديث المقال.', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      showNotification('حدث خطأ أثناء حفظ المقال.', 'error');
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div>
      <h2 class="text-2xl font-bold text-purple-600 mb-4">إدارة المقالات</h2>
      <button
        onClick={handleAddNewPost}
        class="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      >
        إضافة مقال جديد
      </button>
      <Show when={editingPost() || isAddingNew()}>
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">عنوان المقال<span class="text-red-500">*</span>:</label>
          <input
            class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            type="text"
            value={editTitle()}
            onInput={(e) => setEditTitle(e.target.value)}
          />
          <label class="block mb-2 text-lg font-semibold text-gray-700">محتوى المقال<span class="text-red-500">*</span>:</label>
          <textarea
            class="w-full h-32 p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            value={editContent()}
            onInput={(e) => setEditContent(e.target.value)}
          />
          <label class="block mb-2 text-lg font-semibold text-gray-700">التصنيف<span class="text-red-500">*</span>:</label>
          <input
            class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            type="text"
            value={editCategory()}
            onInput={(e) => setEditCategory(e.target.value)}
          />
          <div class="flex space-x-reverse space-x-4">
            <button
              onClick={handleSavePost}
              class={`flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 ${
                loadingSave() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              disabled={loadingSave()}
            >
              <Show when={!loadingSave()} fallback="جاري الحفظ...">
                {isAddingNew() ? 'إضافة المقال' : 'حفظ التغييرات'}
              </Show>
            </button>
            <button
              onClick={handleCancelEdit}
              class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Show>
      <Show when={loadingPosts()}>
        <Loader loading={loadingPosts()} />
      </Show>
      <Show when={!loadingPosts() && posts().length > 0}>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="border px-4 py-2">العنوان</th>
                <th class="border px-4 py-2">التصنيف</th>
                <th class="border px-4 py-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <For each={posts()}>
                {(post) => (
                  <tr>
                    <td class="border px-4 py-2">{post.title}</td>
                    <td class="border px-4 py-2">{post.category}</td>
                    <td class="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleEditPost(post)}
                        class="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mr-2 cursor-pointer"
                      >
                        تحرير
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        class={`px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 ${
                          loadingDelete() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        disabled={loadingDelete()}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
      <Show when={!loadingPosts() && posts().length === 0}>
        <p class="text-lg text-center text-gray-700">لا توجد مقالات.</p>
      </Show>
    </div>
  );
}

export default BlogPostManagement;