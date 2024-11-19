import { createSignal, For, Show, onMount } from 'solid-js';
import { createNotification } from '../components/Notification';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import { createStore } from 'solid-js/store';
import { blogPosts, shopItems } from '../drizzle/schema.js';

function AdminDashboard() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();
  const [messages, setMessages] = createSignal([]);
  const [users, setUsers] = createSignal([]);
  const [filterType, setFilterType] = createSignal('');
  const [loadingMessages, setLoadingMessages] = createSignal(true);
  const [loadingUsers, setLoadingUsers] = createSignal(true);
  const [activeTab, setActiveTab] = createSignal('messages');

  // New state for blog posts and shop items
  const [blogPostsData, setBlogPostsData] = createStore({ posts: [] });
  const [shopItemsData, setShopItemsData] = createStore({ items: [] });
  const [loadingBlogPosts, setLoadingBlogPosts] = createSignal(true);
  const [loadingShopItems, setLoadingShopItems] = createSignal(true);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getMessages', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else if (response.status === 403) {
        showNotification('غير مصرح لك بالوصول إلى هذه الصفحة.', 'error');
        navigate('/');
      } else {
        showNotification('حدث خطأ أثناء جلب الرسائل.', 'error');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      showNotification('حدث خطأ أثناء جلب الرسائل.', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getUsers', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else if (response.status === 403) {
        showNotification('غير مصرح لك بالوصول إلى هذه الصفحة.', 'error');
        navigate('/');
      } else {
        showNotification('حدث خطأ أثناء جلب المستخدمين.', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('حدث خطأ أثناء جلب المستخدمين.', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    setLoadingBlogPosts(true);
    try {
      const response = await fetch('/api/getBlogPosts');
      if (response.ok) {
        const data = await response.json();
        setBlogPostsData({ posts: data });
      } else {
        showNotification('حدث خطأ أثناء جلب المقالات.', 'error');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      showNotification('حدث خطأ أثناء جلب المقالات.', 'error');
    } finally {
      setLoadingBlogPosts(false);
    }
  };

  // Fetch shop items
  const fetchShopItems = async () => {
    setLoadingShopItems(true);
    try {
      const response = await fetch('/api/getShopItems');
      if (response.ok) {
        const data = await response.json();
        setShopItemsData({ items: data });
      } else {
        showNotification('حدث خطأ أثناء جلب المنتجات.', 'error');
      }
    } catch (error) {
      console.error('Error fetching shop items:', error);
      showNotification('حدث خطأ أثناء جلب المنتجات.', 'error');
    } finally {
      setLoadingShopItems(false);
    }
  };

  onMount(() => {
    fetchMessages();
    fetchUsers();
    fetchBlogPosts();
    fetchShopItems();
  });

  const filteredMessages = () => {
    if (filterType()) {
      return messages().filter(message => message.type === filterType());
    }
    return messages();
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/deleteUser', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId })
      });

      if (response.ok) {
        showNotification('تم حذف المستخدم بنجاح.', 'success');
        setUsers(users().filter(user => user.id !== userId));
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حذف المستخدم.', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('حدث خطأ أثناء حذف المستخدم.', 'error');
    }
  };

  // Manage blog posts
  const [newPost, setNewPost] = createStore({ id: null, title: '', content: '' });
  const [editingPostId, setEditingPostId] = createSignal(null);

  const handleSaveBlogPost = async () => {
    if (!newPost.title || !newPost.content) {
      showNotification('يرجى تعبئة الحقول المطلوبة.', 'error');
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const method = editingPostId() ? 'PUT' : 'POST';
      const response = await fetch('/api/saveBlogPost', {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        showNotification('تم حفظ المقال بنجاح.', 'success');
        setNewPost({ id: null, title: '', content: '' });
        setEditingPostId(null);
        fetchBlogPosts();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حفظ المقال.', 'error');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      showNotification('حدث خطأ أثناء حفظ المقال.', 'error');
    }
  };

  const handleEditBlogPost = (post) => {
    setNewPost({ ...post });
    setEditingPostId(post.id);
  };

  const handleDeleteBlogPost = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/saveBlogPost', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        showNotification('تم حذف المقال بنجاح.', 'success');
        fetchBlogPosts();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حذف المقال.', 'error');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      showNotification('حدث خطأ أثناء حذف المقال.', 'error');
    }
  };

  // Similar functions for shop items
  const [newItem, setNewItem] = createStore({ id: null, name: '', description: '', price: '', imageUrl: '' });
  const [editingItemId, setEditingItemId] = createSignal(null);

  const handleSaveShopItem = async () => {
    if (!newItem.name || !newItem.price) {
      showNotification('يرجى تعبئة الحقول المطلوبة.', 'error');
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const method = editingItemId() ? 'PUT' : 'POST';
      const response = await fetch('/api/saveShopItem', {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        showNotification('تم حفظ المنتج بنجاح.', 'success');
        setNewItem({ id: null, name: '', description: '', price: '', imageUrl: '' });
        setEditingItemId(null);
        fetchShopItems();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حفظ المنتج.', 'error');
      }
    } catch (error) {
      console.error('Error saving shop item:', error);
      showNotification('حدث خطأ أثناء حفظ المنتج.', 'error');
    }
  };

  const handleEditShopItem = (item) => {
    setNewItem({ ...item });
    setEditingItemId(item.id);
  };

  const handleDeleteShopItem = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/saveShopItem', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        showNotification('تم حذف المنتج بنجاح.', 'success');
        fetchShopItems();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حذف المنتج.', 'error');
      }
    } catch (error) {
      console.error('Error deleting shop item:', error);
      showNotification('حدث خطأ أثناء حذف المنتج.', 'error');
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم الإدارية</h1>
      <div class="flex flex-wrap justify-center space-x-reverse space-x-4 mb-6">
        <button
          class={`px-4 py-2 rounded-lg ${activeTab() === 'messages' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
          onClick={() => setActiveTab('messages')}
        >
          إدارة الرسائل
        </button>
        <button
          class={`px-4 py-2 rounded-lg ${activeTab() === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
          onClick={() => setActiveTab('users')}
        >
          إدارة المستخدمين
        </button>
        <button
          class={`px-4 py-2 rounded-lg ${activeTab() === 'blog' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
          onClick={() => setActiveTab('blog')}
        >
          إدارة المدونة
        </button>
        <button
          class={`px-4 py-2 rounded-lg ${activeTab() === 'shop' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
          onClick={() => setActiveTab('shop')}
        >
          إدارة المتجر
        </button>
      </div>

      <Show when={activeTab() === 'messages'}>
        {/* Existing messages management code */}
        {/* ... */}
      </Show>

      <Show when={activeTab() === 'users'}>
        {/* Existing users management code */}
        {/* ... */}
      </Show>

      <Show when={activeTab() === 'blog'}>
        <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
          يمكنك هنا إدارة المقالات في المدونة.
        </p>
        <div class="w-full max-w-4xl">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">إضافة/تحرير مقال</h2>
          <div class="mb-6">
            <label class="block mb-2 text-lg font-semibold text-gray-700">العنوان<span class="text-red-500">*</span>:</label>
            <input
              class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              type="text"
              value={newPost.title}
              onInput={(e) => setNewPost('title', e.target.value)}
            />
            <label class="block mb-2 text-lg font-semibold text-gray-700">المحتوى<span class="text-red-500">*</span>:</label>
            <textarea
              class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              rows="6"
              value={newPost.content}
              onInput={(e) => setNewPost('content', e.target.value)}
            />
            <button
              onClick={handleSaveBlogPost}
              class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              {editingPostId() ? 'تحديث المقال' : 'إضافة المقال'}
            </button>
          </div>

          <h2 class="text-2xl font-bold mb-4 text-purple-600">جميع المقالات</h2>
          <Show when={!loadingBlogPosts()} fallback={<p class="text-center">جاري تحميل المقالات...</p>}>
            <For each={blogPostsData.posts}>
              {(post) => (
                <div class="mb-4 p-4 border border-gray-300 rounded-lg shadow-md">
                  <h3 class="text-xl font-bold mb-2">{post.title}</h3>
                  <p class="text-gray-700">{post.content.slice(0, 100)}...</p>
                  <div class="flex space-x-reverse space-x-4 mt-2">
                    <button
                      onClick={() => handleEditBlogPost(post)}
                      class="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200 cursor-pointer"
                    >
                      تحرير
                    </button>
                    <button
                      onClick={() => handleDeleteBlogPost(post.id)}
                      class="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </Show>

      <Show when={activeTab() === 'shop'}>
        <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
          يمكنك هنا إدارة المنتجات في المتجر.
        </p>
        <div class="w-full max-w-4xl">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">إضافة/تحرير منتج</h2>
          <div class="mb-6">
            <label class="block mb-2 text-lg font-semibold text-gray-700">اسم المنتج<span class="text-red-500">*</span>:</label>
            <input
              class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              type="text"
              value={newItem.name}
              onInput={(e) => setNewItem('name', e.target.value)}
            />
            <label class="block mb-2 text-lg font-semibold text-gray-700">الوصف:</label>
            <textarea
              class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              rows="4"
              value={newItem.description}
              onInput={(e) => setNewItem('description', e.target.value)}
            />
            <label class="block mb-2 text-lg font-semibold text-gray-700">السعر<span class="text-red-500">*</span>:</label>
            <input
              class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              type="number"
              step="0.01"
              value={newItem.price}
              onInput={(e) => setNewItem('price', e.target.value)}
            />
            <label class="block mb-2 text-lg font-semibold text-gray-700">رابط الصورة:</label>
            <input
              class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              type="text"
              value={newItem.imageUrl}
              onInput={(e) => setNewItem('imageUrl', e.target.value)}
            />
            <button
              onClick={handleSaveShopItem}
              class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              {editingItemId() ? 'تحديث المنتج' : 'إضافة المنتج'}
            </button>
          </div>

          <h2 class="text-2xl font-bold mb-4 text-purple-600">جميع المنتجات</h2>
          <Show when={!loadingShopItems()} fallback={<p class="text-center">جاري تحميل المنتجات...</p>}>
            <For each={shopItemsData.items}>
              {(item) => (
                <div class="mb-4 p-4 border border-gray-300 rounded-lg shadow-md">
                  <h3 class="text-xl font-bold mb-2">{item.name}</h3>
                  <p class="text-gray-700 mb-2">{item.description}</p>
                  <p class="text-gray-700 mb-2">السعر: {item.price} دولار</p>
                  <Show when={item.imageUrl}>
                    <img src={item.imageUrl} alt={item.name} class="w-full h-auto mb-2 rounded-lg" />
                  </Show>
                  <div class="flex space-x-reverse space-x-4 mt-2">
                    <button
                      onClick={() => handleEditShopItem(item)}
                      class="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200 cursor-pointer"
                    >
                      تحرير
                    </button>
                    <button
                      onClick={() => handleDeleteShopItem(item.id)}
                      class="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default AdminDashboard;