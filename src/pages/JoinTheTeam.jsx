import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createNotification } from '../components/Notification';
import BackButton from '../components/BackButton';
import Loader from '../components/Loader';

function JoinTheTeam() {
  const navigate = useNavigate();
  const { NotificationComponent, showNotification } = createNotification();

  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [phone, setPhone] = createSignal('');
  const [message, setMessage] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async () => {
    if (!name() || !email() || !message()) {
      showNotification('يرجى تعبئة الحقول المطلوبة.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/saveMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'join_team',
          name: name(),
          email: email(),
          phone: phone(),
          message: message(),
        }),
      });

      if (response.ok) {
        showNotification('تم إرسال طلبك بنجاح. سنتواصل معك قريبًا.', 'success');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        const data = await response.json();
        showNotification(data.error || 'حدث خطأ أثناء إرسال الطلب.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('حدث خطأ أثناء إرسال الطلب.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <BackButton />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">انضم إلى الفريق</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        هل ترغب في أن تكون جزءًا من فريقنا المميز؟ يرجى ملء النموذج أدناه وسنتواصل معك قريبًا.
      </p>

      <div class="w-full max-w-md">
        <label class="block mb-2 text-lg font-semibold text-gray-700">الاسم الكامل<span class="text-red-500">*</span>:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          type="text"
          value={name()}
          onInput={(e) => setName(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">البريد الإلكتروني<span class="text-red-500">*</span>:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          type="email"
          value={email()}
          onInput={(e) => setEmail(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">رقم الهاتف:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          type="tel"
          value={phone()}
          onInput={(e) => setPhone(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">رسالتك<span class="text-red-500">*</span>:</label>
        <textarea
          class="w-full h-32 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          value={message()}
          onInput={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
            transition duration-300 ease-in-out transform hover:scale-105 ${
              loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          disabled={loading()}
        >
          <Show when={!loading()} fallback={<Loader />}>
            إرسال
          </Show>
        </button>
      </div>
    </div>
  );
}

export default JoinTheTeam;