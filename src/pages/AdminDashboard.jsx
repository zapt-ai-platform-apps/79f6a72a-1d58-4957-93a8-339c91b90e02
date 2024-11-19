import { createSignal, For, Show, onMount } from 'solid-js';
import { createNotification } from '../components/Notification';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import { createStore } from 'solid-js/store';
import Loader from '../components/Loader';

function AdminDashboard() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();
  const [loading, setLoading] = createSignal(true);
  const [activeTab, setActiveTab] = createSignal('pages');

  const [pagesData, setPagesData] = createStore({ pages: [] });
  const [blogPostsData, setBlogPostsData] = createStore({ blogPosts: [] });
  const [shopItemsData, setShopItemsData] = createStore({ shopItems: [] });
  const [messagesData, setMessagesData] = createStore({ messages: [] });
  const [usersData, setUsersData] = createStore({ users: [] });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (activeTab() === 'pages') {
        const pagesRes = await fetch('/api/getPages', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });

        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();
          setPagesData({ pages: pagesData });
        } else {
          showNotification('حدث خطأ أثناء جلب الصفحات.', 'error');
        }
      } else if (activeTab() === 'blogPosts') {
        const blogRes = await fetch('/api/getBlogPosts', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });

        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setBlogPostsData({ blogPosts: blogData });
        } else {
          showNotification('حدث خطأ أثناء جلب المقالات.', 'error');
        }
      } else if (activeTab() === 'shopItems') {
        const shopRes = await fetch('/api/getShopItems', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });

        if (shopRes.ok) {
          const shopData = await shopRes.json();
          setShopItemsData({ shopItems: shopData });
        } else {
          showNotification('حدث خطأ أثناء جلب المنتجات.', 'error');
        }
      } else if (activeTab() === 'messages') {
        const messagesRes = await fetch('/api/getMessages', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setMessagesData({ messages: messagesData });
        } else {
          showNotification('حدث خطأ أثناء جلب الرسائل.', 'error');
        }
      } else if (activeTab() === 'users') {
        const usersRes = await fetch('/api/getUsers', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsersData({ users: usersData.users });
        } else {
          showNotification('حدث خطأ أثناء جلب المستخدمين.', 'error');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('حدث خطأ أثناء جلب البيانات.', 'error');
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchData();
  });

  const [newPage, setNewPage] = createStore({ id: null, title: '', content: '' });
  const [editingPageId, setEditingPageId] = createSignal(null);

  const [newBlogPost, setNewBlogPost] = createStore({ id: null, title: '', content: '' });
  const [editingBlogPostId, setEditingBlogPostId] = createSignal(null);

  const [newShopItem, setNewShopItem] = createStore({ id: null, name: '', description: '', price: '', imageUrl: '' });
  const [editingShopItemId, setEditingShopItemId] = createSignal(null);

  const handleSavePage = async () => {
    if (!newPage.title || !newPage.content) {
      showNotification('يرجى تعبئة الحقول المطلوبة.', 'error');
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const method = editingPageId() ? 'PUT' : 'POST';
      const response = await fetch('/api/savePage', {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPage),
      });

      if (response.ok) {
        showNotification('تم حفظ الصفحة بنجاح.', 'success');
        setNewPage({ id: null, title: '', content: '' });
        setEditingPageId(null);
        fetchData();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حفظ الصفحة.', 'error');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      showNotification('حدث خطأ أثناء حفظ الصفحة.', 'error');
    }
  };

  const handleEditPage = (page) => {
    setNewPage({ ...page });
    setEditingPageId(page.id);
  };

  const handleDeletePage = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/savePage', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        showNotification('تم حذف الصفحة بنجاح.', 'success');
        fetchData();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حذف الصفحة.', 'error');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      showNotification('حدث خطأ أثناء حذف الصفحة.', 'error');
    }
  };

  const handleSaveBlogPost = async () => {
    if (!newBlogPost.title || !newBlogPost.content) {
      showNotification('يرجى تعبئة الحقول المطلوبة.', 'error');
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const method = editingBlogPostId() ? 'PUT' : 'POST';
      const response = await fetch('/api/saveBlogPost', {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlogPost),
      });

      if (response.ok) {
        showNotification('تم حفظ المقالة بنجاح.', 'success');
        setNewBlogPost({ id: null, title: '', content: '' });
        setEditingBlogPostId(null);
        fetchData();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حفظ المقالة.', 'error');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      showNotification('حدث خطأ أثناء حفظ المقالة.', 'error');
    }
  };

  const handleEditBlogPost = (post) => {
    setNewBlogPost({ ...post });
    setEditingBlogPostId(post.id);
  };

  const handleDeleteBlogPost = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه المقالة؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/saveBlogPost', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        showNotification('تم حذف المقالة بنجاح.', 'success');
        fetchData();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حذف المقالة.', 'error');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      showNotification('حدث خطأ أثناء حذف المقالة.', 'error');
    }
  };

  const handleSaveShopItem = async () => {
    if (!newShopItem.name || !newShopItem.price) {
      showNotification('يرجى تعبئة الحقول المطلوبة.', 'error');
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const method = editingShopItemId() ? 'PUT' : 'POST';
      const response = await fetch('/api/saveShopItem', {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newShopItem),
      });

      if (response.ok) {
        showNotification('تم حفظ المنتج بنجاح.', 'success');
        setNewShopItem({ id: null, name: '', description: '', price: '', imageUrl: '' });
        setEditingShopItemId(null);
        fetchData();
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
    setNewShopItem({ ...item });
    setEditingShopItemId(item.id);
  };

  const handleDeleteShopItem = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/saveShopItem', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        showNotification('تم حذف المنتج بنجاح.', 'success');
        fetchData();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حذف المنتج.', 'error');
      }
    } catch (error) {
      console.error('Error deleting shop item:', error);
      showNotification('حدث خطأ أثناء حذف المنتج.', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/deleteMessage', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        showNotification('تم حذف الرسالة بنجاح.', 'success');
        fetchData();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حذف الرسالة.', 'error');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showNotification('حدث خطأ أثناء حذف الرسالة.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/deleteUser', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        showNotification('تم حذف المستخدم بنجاح.', 'success');
        fetchData();
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء حذف المستخدم.', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('حدث خطأ أثناء حذف المستخدم.', 'error');
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
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
          class={`px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            activeTab() === 'pages' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('pages');
            fetchData();
          }}
        >
          الصفحات
        </button>
        <button
          class={`px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            activeTab() === 'blogPosts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('blogPosts');
            fetchData();
          }}
        >
          المقالات
        </button>
        <button
          class={`px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            activeTab() === 'shopItems' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('shopItems');
            fetchData();
          }}
        >
          المنتجات
        </button>
        <button
          class={`px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            activeTab() === 'messages' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('messages');
            fetchData();
          }}
        >
          الرسائل
        </button>
        <button
          class={`px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            activeTab() === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('users');
            fetchData();
          }}
        >
          المستخدمون
        </button>
      </div>

      <Show when={!loading()} fallback={<Loader />}>
        <div class="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          <Show when={activeTab() === 'pages'}>
            {/* Existing code for managing pages */}
            {/* ... */}
          </Show>

          <Show when={activeTab() === 'blogPosts'}>
            {/* Existing code for managing blog posts */}
            {/* ... */}
          </Show>

          <Show when={activeTab() === 'shopItems'}>
            {/* Existing code for managing shop items */}
            {/* ... */}
          </Show>

          <Show when={activeTab() === 'messages'}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">إدارة الرسائل</h2>
            <Show when={messagesData.messages.length > 0} fallback={<p class="text-center">لا توجد رسائل.</p>}>
              <For each={messagesData.messages}>
                {(message) => (
                  <div class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md flex flex-col">
                    <h4 class="text-lg font-bold mb-2">الاسم: {message.name}</h4>
                    <p class="text-gray-700 mb-1">البريد الإلكتروني: {message.email}</p>
                    <Show when={message.phone}>
                      <p class="text-gray-700 mb-1">رقم الهاتف: {message.phone}</p>
                    </Show>
                    <p class="text-gray-700 mb-1">النوع: {message.type === 'contact' ? 'اتصل بنا' : 'انضم إلينا'}</p>
                    <p class="text-gray-700">الرسالة: {message.message}</p>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      class="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </For>
            </Show>
          </Show>

          <Show when={activeTab() === 'users'}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">إدارة المستخدمين</h2>
            <Show when={usersData.users.length > 0} fallback={<p class="text-center">لا يوجد مستخدمون.</p>}>
              <For each={usersData.users}>
                {(user) => (
                  <div class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div class="flex-grow mb-4 md:mb-0">
                      <p class="text-gray-700 mb-1">البريد الإلكتروني: {user.email}</p>
                      <p class="text-gray-700 mb-1">المعرف: {user.id}</p>
                      <p class="text-gray-700 mb-1">تاريخ الإنشاء: {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="flex space-x-reverse space-x-2">
                      <Show when={user.email !== 'daoudi.abdennour@gmail.com'}>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        >
                          حذف
                        </button>
                      </Show>
                    </div>
                  </div>
                )}
              </For>
            </Show>
          </Show>

          <Show when={
            activeTab() !== 'pages' &&
            activeTab() !== 'blogPosts' &&
            activeTab() !== 'shopItems' &&
            activeTab() !== 'messages' &&
            activeTab() !== 'users'
          }>
            <div class="text-center text-gray-500">
              <p>هذا القسم قيد التطوير. يرجى الانتظار حتى يتم تحديثه قريبًا.</p>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default AdminDashboard;