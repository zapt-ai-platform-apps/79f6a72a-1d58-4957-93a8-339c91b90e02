import { createSignal, onMount, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase, createEvent } from '../supabaseClient';
import { useNotification } from '../components/NotificationProvider';
import Loader from '../components/Loader';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);
  const [messages, setMessages] = createSignal([]);
  const [loadingMessages, setLoadingMessages] = createSignal(false);
  const [users, setUsers] = createSignal([]);
  const [loadingUsers, setLoadingUsers] = createSignal(false);
  const showNotification = useNotification();
  const [activeTab, setActiveTab] = createSignal('messages');

  // New states for blog management
  const [blogPosts, setBlogPosts] = createSignal([]);
  const [loadingBlogPosts, setLoadingBlogPosts] = createSignal(false);
  const [newPostTitle, setNewPostTitle] = createSignal('');
  const [newPostContent, setNewPostContent] = createSignal('');
  const [newPostCategory, setNewPostCategory] = createSignal('');
  const [creatingPost, setCreatingPost] = createSignal(false);

  // Categories for blog posts
  const [categories] = createSignal([
    'أحدث الأخبار والمستجدات التقنية',
    'قارئات الشاشة',
    'برامج وتطبيقات',
    'حصريات',
    'دروس وشروحات',
  ]);

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email === 'daoudi.abdennour@gmail.com') {
      setUser(user);
      fetchAllMessages();
      fetchAllUsers();
      fetchAllBlogPosts();
    } else {
      // ليس مشرفاً، إعادة التوجيه إلى الصفحة الرئيسية
      navigate('/', { replace: true });
    }
  });

  const fetchAllMessages = async () => {
    // ... existing code
  };

  const fetchAllUsers = async () => {
    // ... existing code
  };

  const fetchAllBlogPosts = async () => {
    setLoadingBlogPosts(true);
    try {
      const response = await fetch('/api/getBlogPosts');
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء جلب المقالات.', 'error');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      showNotification('حدث خطأ أثناء جلب المقالات.', 'error');
    } finally {
      setLoadingBlogPosts(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle() || !newPostContent() || !newPostCategory()) {
      showNotification('يرجى تعبئة جميع الحقول.', 'error');
      return;
    }
    setCreatingPost(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/saveBlogPost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPostTitle(),
          content: newPostContent(),
          category: newPostCategory(),
        }),
      });
      if (response.ok) {
        showNotification('تم إنشاء المقال بنجاح.', 'success');
        // Reset form
        setNewPostTitle('');
        setNewPostContent('');
        setNewPostCategory('');
        fetchAllBlogPosts();
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء إنشاء المقال.', 'error');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      showNotification('حدث خطأ أثناء إنشاء المقال.', 'error');
    } finally {
      setCreatingPost(false);
    }
  };

  const handleGeneratePost = async () => {
    if (!newPostTitle() || !newPostCategory()) {
      showNotification('يرجى تعبئة العنوان والتصنيف.', 'error');
      return;
    }
    setCreatingPost(true);
    try {
      const prompt = `اكتب مقالة بعنوان "${newPostTitle()}" في تصنيف "${newPostCategory()}" باللغة العربية.`;
      const content = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setNewPostContent(content);
      showNotification('تم توليد المحتوى بنجاح.', 'success');
    } catch (error) {
      console.error('Error generating post content:', error);
      showNotification('حدث خطأ أثناء توليد المحتوى.', 'error');
    } finally {
      setCreatingPost(false);
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم</h1>

      <div class="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('messages')}
          class={`px-4 py-2 rounded-lg cursor-pointer ${
            activeTab() === 'messages' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          الرسائل
        </button>
        <button
          onClick={() => setActiveTab('users')}
          class={`px-4 py-2 rounded-lg cursor-pointer ${
            activeTab() === 'users' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          المستخدمون
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          class={`px-4 py-2 rounded-lg cursor-pointer ${
            activeTab() === 'analytics' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          التحليلات
        </button>
        <button
          onClick={() => setActiveTab('sendMessage')}
          class={`px-4 py-2 rounded-lg cursor-pointer ${
            activeTab() === 'sendMessage' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          إرسال رسالة للمستخدمين
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          class={`px-4 py-2 rounded-lg cursor-pointer ${
            activeTab() === 'blog' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          إدارة المدونة
        </button>
      </div>

      {/* Existing tab contents... */}

      <Show when={activeTab() === 'blog'}>
        <div class="w-full max-w-2xl">
          <h2 class="text-2xl font-bold text-purple-600 mb-4">المقالات:</h2>
          <Show when={loadingBlogPosts()}>
            <Loader loading={loadingBlogPosts()} />
          </Show>
          <Show when={!loadingBlogPosts() && blogPosts().length === 0}>
            <p class="text-lg text-center text-gray-700">لا توجد مقالات لعرضها.</p>
          </Show>
          <Show when={!loadingBlogPosts() && blogPosts().length > 0}>
            <For each={blogPosts()}>
              {(post) => (
                <div class="mb-4 p-4 bg-white rounded-lg shadow-md">
                  <h3 class="text-xl font-bold text-gray-800">{post.title}</h3>
                  <p class="text-sm text-gray-600">التصنيف: {post.category}</p>
                  <p class="text-sm text-gray-600">تاريخ النشر: {new Date(post.createdAt).toLocaleString()}</p>
                </div>
              )}
            </For>
          </Show>
          <div class="mt-6">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">إنشاء مقالة جديدة:</h2>
            <div class="mb-4">
              <label class="block mb-2 text-lg font-semibold text-gray-700">العنوان:</label>
              <input
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                type="text"
                value={newPostTitle()}
                onInput={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-lg font-semibold text-gray-700">التصنيف:</label>
              <select
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
                value={newPostCategory()}
                onInput={(e) => setNewPostCategory(e.target.value)}
              >
                <option value="">-- اختر التصنيف --</option>
                <For each={categories()}>
                  {(category) => (
                    <option value={category}>{category}</option>
                  )}
                </For>
              </select>
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-lg font-semibold text-gray-700">المحتوى:</label>
              <textarea
                class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                value={newPostContent()}
                onInput={(e) => setNewPostContent(e.target.value)}
              />
            </div>
            <div class="flex space-x-4">
              <button
                onClick={handleCreatePost}
                class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mb-4 ${
                  creatingPost() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                disabled={creatingPost()}
              >
                <Show when={!creatingPost()} fallback="جاري الحفظ...">
                  حفظ المقال
                </Show>
              </button>
              <button
                onClick={handleGeneratePost}
                class={`flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 mb-4 ${
                  creatingPost() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                disabled={creatingPost()}
              >
                <Show when={!creatingPost()} fallback="جاري التوليد...">
                  توليد المحتوى بالذكاء الاصطناعي
                </Show>
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default AdminDashboard;