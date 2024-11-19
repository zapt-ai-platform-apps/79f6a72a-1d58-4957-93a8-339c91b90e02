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
  const [menusData, setMenusData] = createStore({ menus: [] });
  const [servicesData, setServicesData] = createStore({ services: [] });
  const [toolsData, setToolsData] = createStore({ tools: [] });
  const [settingsData, setSettingsData] = createStore({ settings: {} });

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
      </div>

      <Show when={!loading()} fallback={<Loader />}>
        <div class="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          <Show when={activeTab() === 'pages'}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">إدارة الصفحات</h2>
            <div class="mb-6">
              <div class="mb-4">
                <label class="block mb-2 text-lg font-semibold text-gray-700">عنوان الصفحة:</label>
                <input
                  class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={newPage.title}
                  onInput={(e) => setNewPage('title', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">محتوى الصفحة:</label>
                <textarea
                  class="w-full h-32 p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  value={newPage.content}
                  onInput={(e) => setNewPage('content', e.target.value)}
                />
                <button
                  onClick={handleSavePage}
                  class="w-full px-6 py-3 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  {editingPageId() ? 'تحديث الصفحة' : 'إضافة صفحة'}
                </button>
              </div>
              <h3 class="text-xl font-bold mb-4 text-purple-600">الصفحات الحالية:</h3>
              <For each={pagesData.pages}>
                {(page) => (
                  <div class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div class="flex-grow mb-4 md:mb-0">
                      <h4 class="text-lg font-bold mb-2">{page.title}</h4>
                      <p class="text-gray-700">{page.content}</p>
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
            </div>
          </Show>

          <Show when={activeTab() === 'blogPosts'}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">إدارة المقالات</h2>
            <div class="mb-6">
              <div class="mb-4">
                <label class="block mb-2 text-lg font-semibold text-gray-700">عنوان المقالة:</label>
                <input
                  class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={newBlogPost.title}
                  onInput={(e) => setNewBlogPost('title', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">محتوى المقالة:</label>
                <textarea
                  class="w-full h-32 p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  value={newBlogPost.content}
                  onInput={(e) => setNewBlogPost('content', e.target.value)}
                />
                <button
                  onClick={handleSaveBlogPost}
                  class="w-full px-6 py-3 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  {editingBlogPostId() ? 'تحديث المقالة' : 'إضافة مقالة'}
                </button>
              </div>
              <h3 class="text-xl font-bold mb-4 text-purple-600">المقالات الحالية:</h3>
              <For each={blogPostsData.blogPosts}>
                {(post) => (
                  <div class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div class="flex-grow mb-4 md:mb-0">
                      <h4 class="text-lg font-bold mb-2">{post.title}</h4>
                      <p class="text-gray-700">{post.content}</p>
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
            </div>
          </Show>

          <Show when={activeTab() === 'shopItems'}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">إدارة المنتجات</h2>
            <div class="mb-6">
              <div class="mb-4">
                <label class="block mb-2 text-lg font-semibold text-gray-700">اسم المنتج:</label>
                <input
                  class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={newShopItem.name}
                  onInput={(e) => setNewShopItem('name', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">وصف المنتج:</label>
                <textarea
                  class="w-full h-24 p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  value={newShopItem.description}
                  onInput={(e) => setNewShopItem('description', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">السعر:</label>
                <input
                  class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="number"
                  value={newShopItem.price}
                  onInput={(e) => setNewShopItem('price', e.target.value)}
                />
                <label class="block mb-2 text-lg font-semibold text-gray-700">رابط صورة المنتج:</label>
                <input
                  class="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  type="text"
                  value={newShopItem.imageUrl}
                  onInput={(e) => setNewShopItem('imageUrl', e.target.value)}
                />
                <button
                  onClick={handleSaveShopItem}
                  class="w-full px-6 py-3 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  {editingShopItemId() ? 'تحديث المنتج' : 'إضافة منتج'}
                </button>
              </div>
              <h3 class="text-xl font-bold mb-4 text-purple-600">المنتجات الحالية:</h3>
              <For each={shopItemsData.shopItems}>
                {(item) => (
                  <div class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div class="flex-grow mb-4 md:mb-0">
                      <h4 class="text-lg font-bold mb-2">{item.name}</h4>
                      <p class="text-gray-700 mb-2">{item.description}</p>
                      <p class="text-gray-700 font-semibold">السعر: {item.price} دولار</p>
                      <Show when={item.image_url}>
                        <img src={item.image_url} alt={item.name} class="w-32 h-auto mt-2 rounded-lg" />
                      </Show>
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
            </div>
          </Show>

          <Show when={activeTab() !== 'pages' && activeTab() !== 'blogPosts' && activeTab() !== 'shopItems'}>
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