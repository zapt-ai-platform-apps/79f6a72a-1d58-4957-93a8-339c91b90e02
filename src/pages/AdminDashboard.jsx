import { createSignal, For, Show, onMount } from 'solid-js';
import { createNotification } from '../components/Notification';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import { createStore } from 'solid-js/store';

function AdminDashboard() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();
  const [messages, setMessages] = createSignal([]);
  const [users, setUsers] = createSignal([]);
  const [filterType, setFilterType] = createSignal('');
  const [loadingMessages, setLoadingMessages] = createSignal(true);
  const [loadingUsers, setLoadingUsers] = createSignal(true);
  const [activeTab, setActiveTab] = createSignal('messages');

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
        {/* إدارة الرسائل */}
        {/* محتوى تبويب الرسائل */}
      </Show>

      <Show when={activeTab() === 'users'}>
        {/* إدارة المستخدمين */}
        {/* محتوى تبويب المستخدمين */}
      </Show>

      <Show when={activeTab() === 'blog'}>
        {/* إدارة المدونة */}
        {/* محتوى تبويب المدونة */}
      </Show>

      <Show when={activeTab() === 'shop'}>
        {/* إدارة المتجر */}
        {/* محتوى تبويب المتجر */}
      </Show>
    </div>
  );
}

export default AdminDashboard;