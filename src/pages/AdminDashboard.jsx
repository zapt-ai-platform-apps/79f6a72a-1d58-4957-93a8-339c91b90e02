import { createSignal, For, Show, onMount, createEffect } from 'solid-js';
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

  createEffect(() => {
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

      <div class="w-full max-w-md mb-6">
        <label class="block mb-2 text-lg font-semibold text-gray-700">اختر القسم:</label>
        <select
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
          value={activeTab()}
          onInput={(e) => setActiveTab(e.target.value)}
        >
          <option value="pages">الصفحات</option>
          <option value="blogPosts">المقالات</option>
          <option value="shopItems">المنتجات</option>
          <option value="messages">الرسائل</option>
          <option value="users">المستخدمون</option>
        </select>
      </div>

      <Show when={!loading()} fallback={<Loader />}>
        <div class="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          <Show when={activeTab() === 'pages'}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">إدارة الصفحات</h2>
            <div class="mb-6">
              <label class="block mb-2 text-lg font-semibold text-gray-700">{editingPageId() ? 'تعديل الصفحة' : 'إضافة صفحة جديدة'}</label>
              <input
                type="text"
                placeholder="عنوان الصفحة"
                value={newPage.title}
                onInput={(e) => setNewPage('title', e.target.value)}
                class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <textarea
                placeholder="محتوى الصفحة"
                value={newPage.content}
                onInput={(e) => setNewPage('content', e.target.value)}
                class="w-full p-3 mb-2 h-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              ></textarea>
              <div class="flex space-x-reverse space-x-4">
                <button
                  onClick={handleSavePage}
                  class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  {editingPageId() ? 'تحديث' : 'حفظ'}
                </button>
                <Show when={editingPageId()}>
                  <button
                    onClick={() => {
                      setNewPage({ id: null, title: '', content: '' });
                      setEditingPageId(null);
                    }}
                    class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </Show>
              </div>
            </div>
            <Show when={pagesData.pages.length > 0} fallback={<p class="text-center">لا توجد صفحات.</p>}>
              <For each={pagesData.pages}>
                {(page) => (
                  <div class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div class="flex-grow mb-4 md:mb-0">
                      <h3 class="text-xl font-bold mb-2">{page.title}</h3>
                      <p class="text-gray-700 whitespace-pre-wrap">{page.content}</p>
                      <p class="text-sm text-gray-500 mt-2">{new Date(page.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="flex space-x-reverse space-x-2">
                      <button
                        onClick={() => handleEditPage(page)}
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </Show>
          </Show>

          <Show when={activeTab() === 'blogPosts'}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">إدارة المقالات</h2>
            <div class="mb-6">
              <label class="block mb-2 text-lg font-semibold text-gray-700">{editingBlogPostId() ? 'تعديل المقالة' : 'إضافة مقالة جديدة'}</label>
              <input
                type="text"
                placeholder="عنوان المقالة"
                value={newBlogPost.title}
                onInput={(e) => setNewBlogPost('title', e.target.value)}
                class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <textarea
                placeholder="محتوى المقالة"
                value={newBlogPost.content}
                onInput={(e) => setNewBlogPost('content', e.target.value)}
                class="w-full p-3 mb-2 h-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              ></textarea>
              <div class="flex space-x-reverse space-x-4">
                <button
                  onClick={handleSaveBlogPost}
                  class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  {editingBlogPostId() ? 'تحديث' : 'حفظ'}
                </button>
                <Show when={editingBlogPostId()}>
                  <button
                    onClick={() => {
                      setNewBlogPost({ id: null, title: '', content: '' });
                      setEditingBlogPostId(null);
                    }}
                    class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </Show>
              </div>
            </div>
            <Show when={blogPostsData.blogPosts.length > 0} fallback={<p class="text-center">لا توجد مقالات.</p>}>
              <For each={blogPostsData.blogPosts}>
                {(post) => (
                  <div class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div class="flex-grow mb-4 md:mb-0">
                      <h3 class="text-xl font-bold mb-2">{post.title}</h3>
                      <p class="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                      <p class="text-sm text-gray-500 mt-2">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="flex space-x-reverse space-x-2">
                      <button
                        onClick={() => handleEditBlogPost(post)}
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteBlogPost(post.id)}
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </Show>
          </Show>

          <Show when={activeTab() === 'shopItems'}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">إدارة المنتجات</h2>
            <div class="mb-6">
              <label class="block mb-2 text-lg font-semibold text-gray-700">{editingShopItemId() ? 'تعديل المنتج' : 'إضافة منتج جديد'}</label>
              <input
                type="text"
                placeholder="اسم المنتج"
                value={newShopItem.name}
                onInput={(e) => setNewShopItem('name', e.target.value)}
                class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="الوصف"
                value={newShopItem.description}
                onInput={(e) => setNewShopItem('description', e.target.value)}
                class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="السعر"
                value={newShopItem.price}
                onInput={(e) => setNewShopItem('price', e.target.value)}
                class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="رابط الصورة"
                value={newShopItem.imageUrl}
                onInput={(e) => setNewShopItem('imageUrl', e.target.value)}
                class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <div class="flex space-x-reverse space-x-4">
                <button
                  onClick={handleSaveShopItem}
                  class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  {editingShopItemId() ? 'تحديث' : 'حفظ'}
                </button>
                <Show when={editingShopItemId()}>
                  <button
                    onClick={() => {
                      setNewShopItem({ id: null, name: '', description: '', price: '', imageUrl: '' });
                      setEditingShopItemId(null);
                    }}
                    class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </Show>
              </div>
            </div>
            <Show when={shopItemsData.shopItems.length > 0} fallback={<p class="text-center">لا توجد منتجات.</p>}>
              <For each={shopItemsData.shopItems}>
                {(item) => (
                  <div class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div class="flex-grow mb-4 md:mb-0">
                      <h3 class="text-xl font-bold mb-2">{item.name}</h3>
                      <p class="text-gray-700 mb-2">{item.description}</p>
                      <p class="text-gray-700 font-semibold">السعر: {item.price} دولار</p>
                      <p class="text-sm text-gray-500 mt-2">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="flex space-x-reverse space-x-2">
                      <button
                        onClick={() => handleEditShopItem(item)}
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteShopItem(item.id)}
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </Show>
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