import { createSignal, onMount, Show, For } from 'solid-js';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';
import Loader from '../components/Loader';
import { useNotification } from '../components/NotificationProvider';

function AdminDashboard() {
  const [user, setUser] = createSignal(null);
  const [isAdmin, setIsAdmin] = createSignal(false);

  const [messages, setMessages] = createSignal([]);
  const [users, setUsers] = createSignal([]);
  const [selectedUser, setSelectedUser] = createSignal('');
  const [messageContent, setMessageContent] = createSignal('');
  const [loadingMessages, setLoadingMessages] = createSignal(false);
  const [loadingUsers, setLoadingUsers] = createSignal(false);
  const [loadingSendMessage, setLoadingSendMessage] = createSignal(false);

  const [blogTitle, setBlogTitle] = createSignal('');
  const [blogContent, setBlogContent] = createSignal('');
  const [blogCategory, setBlogCategory] = createSignal('');
  const [loadingSaveBlogPost, setLoadingSaveBlogPost] = createSignal(false);

  const [allUsers, setAllUsers] = createSignal([]);
  const [loadingAllUsers, setLoadingAllUsers] = createSignal(false);

  const [posts, setPosts] = createSignal([]);
  const [loadingPosts, setLoadingPosts] = createSignal(false);

  const [comments, setComments] = createSignal([]);
  const [loadingComments, setLoadingComments] = createSignal(false);

  const navigate = useNavigate();
  const showNotification = useNotification();

  onMount(async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user && user.email === 'daoudi.abdennour@gmail.com') {
      setIsAdmin(true);
      fetchMessages();
      fetchUsers();
      fetchAllUsers();
      fetchPosts();
      fetchComments();
    } else {
      setIsAdmin(false);
    }
  });

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getAllMessages', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء جلب الرسائل.', 'error');
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
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء جلب المستخدمين.', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('حدث خطأ أثناء جلب المستخدمين.', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoadingAllUsers(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getAllUsers', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء جلب جميع المستخدمين.', 'error');
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
      showNotification('حدث خطأ أثناء جلب جميع المستخدمين.', 'error');
    } finally {
      setLoadingAllUsers(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch('/api/getBlogPosts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء جلب المقالات.', 'error');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      showNotification('حدث خطأ أثناء جلب المقالات.', 'error');
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetch('/api/getAllComments');
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء جلب التعليقات.', 'error');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      showNotification('حدث خطأ أثناء جلب التعليقات.', 'error');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser() || !messageContent()) {
      showNotification('يرجى تحديد مستخدم وكتابة رسالة.', 'error');
      return;
    }
    setLoadingSendMessage(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedUser(),
          message: messageContent(),
        }),
      });
      if (response.ok) {
        showNotification('تم إرسال الرسالة بنجاح.', 'success');
        setMessageContent('');
        setSelectedUser('');
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء إرسال الرسالة.', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('حدث خطأ أثناء إرسال الرسالة.', 'error');
    } finally {
      setLoadingSendMessage(false);
    }
  };

  const handleSaveBlogPost = async () => {
    if (!blogTitle() || !blogContent() || !blogCategory()) {
      showNotification('يرجى تعبئة الحقول المطلوبة.', 'error');
      return;
    }
    setLoadingSaveBlogPost(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/saveBlogPost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: blogTitle(),
          content: blogContent(),
          category: blogCategory(),
        }),
      });
      if (response.ok) {
        showNotification('تم حفظ المقال بنجاح.', 'success');
        setBlogTitle('');
        setBlogContent('');
        setBlogCategory('');
        fetchPosts();
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء حفظ المقال.', 'error');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      showNotification('حدث خطأ أثناء حفظ المقال.', 'error');
    } finally {
      setLoadingSaveBlogPost(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/deleteBlogPost', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });
      if (response.ok) {
        showNotification('تم حذف المقال بنجاح.', 'success');
        fetchPosts();
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء حذف المقال.', 'error');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showNotification('حدث خطأ أثناء حذف المقال.', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/deleteComment', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });
      if (response.ok) {
        showNotification('تم حذف التعليق بنجاح.', 'success');
        fetchComments();
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء حذف التعليق.', 'error');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      showNotification('حدث خطأ أثناء حذف التعليق.', 'error');
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    if (!confirm(`هل أنت متأكد من ${isActive ? 'تعطيل' : 'تفعيل'} هذا المستخدم؟`)) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/toggleUserStatus', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isActive }),
      });
      if (response.ok) {
        showNotification(`تم ${isActive ? 'تعطيل' : 'تفعيل'} المستخدم بنجاح.`, 'success');
        fetchAllUsers();
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'حدث خطأ أثناء تحديث حالة المستخدم.', 'error');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      showNotification('حدث خطأ أثناء تحديث حالة المستخدم.', 'error');
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <Show when={isAdmin()} fallback={<p class="text-lg text-center text-gray-700">ليس لديك صلاحية الوصول إلى هذه الصفحة.</p>}>
        <h1 class="text-4xl font-bold text-purple-600 mb-6">لوحة التحكم الإدارية</h1>
        <div class="w-full max-w-6xl">
          {/* إدارة المستخدمين */}
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">إدارة المستخدمين</h2>
            <Show when={loadingAllUsers()}>
              <Loader loading={loadingAllUsers()} />
            </Show>
            <Show when={!loadingAllUsers() && allUsers().length > 0}>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th class="py-2 px-4 border-b">البريد الإلكتروني</th>
                      <th class="py-2 px-4 border-b">الحالة</th>
                      <th class="py-2 px-4 border-b">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={allUsers()}>
                      {(user) => (
                        <tr>
                          <td class="py-2 px-4 border-b">{user.email}</td>
                          <td class="py-2 px-4 border-b">{user.confirmed_at ? 'مفعّل' : 'غير مفعّل'}</td>
                          <td class="py-2 px-4 border-b">
                            <button
                              onClick={() => handleToggleUserStatus(user.id, !!user.confirmed_at)}
                              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                            >
                              {user.confirmed_at ? 'تعطيل' : 'تفعيل'}
                            </button>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
            <Show when={!loadingAllUsers() && allUsers().length === 0}>
              <p class="text-lg text-center text-gray-700">لا يوجد مستخدمون.</p>
            </Show>
          </div>
          {/* إدارة المقالات */}
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">إدارة المقالات</h2>
            <Show when={loadingPosts()}>
              <Loader loading={loadingPosts()} />
            </Show>
            <Show when={!loadingPosts() && posts().length > 0}>
              <div class="space-y-4">
                <For each={posts()}>
                  {(post) => (
                    <div class="p-4 bg-white rounded-lg shadow-md">
                      <h3 class="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                      <p class="text-gray-600 mb-2">التصنيف: {post.category}</p>
                      <p class="text-gray-700 mb-2">المحتوى: {post.content.substring(0, 100)}...</p>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </Show>
            <Show when={!loadingPosts() && posts().length === 0}>
              <p class="text-lg text-center text-gray-700">لا توجد مقالات.</p>
            </Show>
          </div>
          {/* إدارة التعليقات */}
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">إدارة التعليقات</h2>
            <Show when={loadingComments()}>
              <Loader loading={loadingComments()} />
            </Show>
            <Show when={!loadingComments() && comments().length > 0}>
              <div class="space-y-4">
                <For each={comments()}>
                  {(comment) => (
                    <div class="p-4 bg-white rounded-lg shadow-md">
                      <p class="text-gray-600 mb-2">تاريخ: {new Date(comment.createdAt).toLocaleString()}</p>
                      <p class="text-gray-700 mb-2">تعليق: {comment.content}</p>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </Show>
            <Show when={!loadingComments() && comments().length === 0}>
              <p class="text-lg text-center text-gray-700">لا توجد تعليقات.</p>
            </Show>
          </div>
          {/* عرض الرسائل */}
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">الرسائل</h2>
            <Show when={loadingMessages()}>
              <Loader loading={loadingMessages()} />
            </Show>
            <Show when={!loadingMessages() && messages().length === 0}>
              <p class="text-lg text-center text-gray-700">لا توجد رسائل لعرضها.</p>
            </Show>
            <Show when={!loadingMessages() && messages().length > 0}>
              <div class="space-y-4">
                <For each={messages()}>
                  {(message) => (
                    <div class="p-4 bg-white rounded-lg shadow-md">
                      <p class="text-sm text-gray-600">تاريخ: {new Date(message.createdAt).toLocaleString()}</p>
                      <p class="text-lg font-semibold text-gray-800 mt-2">النوع: {message.type}</p>
                      <p class="text-gray-700 mt-2">الاسم: {message.name}</p>
                      <p class="text-gray-700 mt-2">البريد الإلكتروني: {message.email}</p>
                      <Show when={message.phone}>
                        <p class="text-gray-700 mt-2">رقم الهاتف: {message.phone}</p>
                      </Show>
                      <p class="text-gray-700 mt-2 whitespace-pre-wrap">الرسالة: {message.message}</p>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
          {/* إرسال رسالة إلى مستخدم */}
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">إرسال رسالة إلى مستخدم</h2>
            <Show when={loadingUsers()}>
              <Loader loading={loadingUsers()} />
            </Show>
            <Show when={!loadingUsers() && users().length > 0}>
              <div class="mb-4">
                <label class="block mb-2 text-lg font-semibold text-gray-700">اختر المستخدم:</label>
                <select
                  class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
                  value={selectedUser()}
                  onInput={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">-- اختر المستخدم --</option>
                  <For each={users()}>
                    {(user) => (
                      <option value={user.id}>{user.email}</option>
                    )}
                  </For>
                </select>
                <label class="block mb-2 text-lg font-semibold text-gray-700">الرسالة:</label>
                <textarea
                  class="w-full h-32 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  value={messageContent()}
                  onInput={(e) => setMessageContent(e.target.value)}
                />
                <button
                  onClick={handleSendMessage}
                  class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                  transition duration-300 ease-in-out transform hover:scale-105 ${
                    loadingSendMessage() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  disabled={loadingSendMessage()}
                >
                  <Show when={!loadingSendMessage()} fallback="جاري الإرسال...">
                    إرسال الرسالة
                  </Show>
                </button>
              </div>
            </Show>
            <Show when={!loadingUsers() && users().length === 0}>
              <p class="text-lg text-center text-gray-700">لا يوجد مستخدمون.</p>
            </Show>
          </div>
          {/* إضافة مقال جديد */}
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">إضافة مقال جديد</h2>
            <div class="mb-4">
              <label class="block mb-2 text-lg font-semibold text-gray-700">عنوان المقال<span class="text-red-500">*</span>:</label>
              <input
                class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                type="text"
                value={blogTitle()}
                onInput={(e) => setBlogTitle(e.target.value)}
              />
              <label class="block mb-2 text-lg font-semibold text-gray-700">محتوى المقال<span class="text-red-500">*</span>:</label>
              <textarea
                class="w-full h-32 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                value={blogContent()}
                onInput={(e) => setBlogContent(e.target.value)}
              />
              <label class="block mb-2 text-lg font-semibold text-gray-700">التصنيف<span class="text-red-500">*</span>:</label>
              <input
                class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                type="text"
                value={blogCategory()}
                onInput={(e) => setBlogCategory(e.target.value)}
              />
              <button
                onClick={handleSaveBlogPost}
                class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 ${
                  loadingSaveBlogPost() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                disabled={loadingSaveBlogPost()}
              >
                <Show when={!loadingSaveBlogPost()} fallback="جاري الحفظ...">
                  حفظ المقال
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