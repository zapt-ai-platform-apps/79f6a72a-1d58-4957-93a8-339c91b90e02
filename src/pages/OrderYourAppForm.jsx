import { useNavigate, useLocation } from '@solidjs/router';
import { createSignal, Show, For } from 'solid-js';
import { createNotification } from '../components/Notification';
import countries from '../data/countries';
import BackButton from '../components/BackButton';
import Loader from '../components/Loader';

function OrderYourAppForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { NotificationComponent, showNotification } = createNotification();

  const queryParams = new URLSearchParams(location.search);
  const selectedPackage = queryParams.get('package') || '';

  const [fullName, setFullName] = createSignal('');
  const [country, setCountry] = createSignal('');
  const [phoneNumber, setPhoneNumber] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [selectedPackageState, setSelectedPackageState] = createSignal(selectedPackage);
  const [additionalNotes, setAdditionalNotes] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const packages = [
    { value: 'free', label: 'الباقة المجانية' },
    { value: 'basic', label: 'الباقة الأساسية' },
    { value: 'professional', label: 'الباقة الاحترافية' },
  ];

  const handleSubmit = async () => {
    if (!fullName() || !country() || !phoneNumber() || !email() || !description() || !selectedPackageState()) {
      showNotification('يرجى تعبئة جميع الحقول المطلوبة.', 'error');
      return;
    }

    setLoading(true);
    try {
      const messageContent = `
الإسم الكامل: ${fullName()}
الدولة: ${country()}
رقم الهاتف: ${phoneNumber()}
البريد الإلكتروني: ${email()}
الباقة المختارة: ${packages.find(pkg => pkg.value === selectedPackageState())?.label || ''}

وصف التطبيق:
${description()}

ملاحظات إضافية:
${additionalNotes()}
      `;

      const response = await fetch('/api/saveMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'app_request',
          name: fullName(),
          email: email(),
          phone: phoneNumber(),
          message: messageContent,
        }),
      });

      if (response.ok) {
        showNotification('تم إرسال طلبك بنجاح. سنتواصل معك قريبًا.', 'success');
        setFullName('');
        setCountry('');
        setPhoneNumber('');
        setEmail('');
        setDescription('');
        setSelectedPackageState('');
        setAdditionalNotes('');
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
      <h1 class="text-4xl font-bold text-purple-600 mb-6">طلب إنشاء تطبيقك الخاص</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        يرجى تعبئة النموذج أدناه وسنقوم بالتواصل معك لتفاصيل أكثر حول طلبك.
      </p>

      <div class="w-full max-w-md">
        <label class="block mb-2 text-lg font-semibold text-gray-700">الإسم الكامل<span class="text-red-500">*</span>:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          type="text"
          value={fullName()}
          onInput={(e) => setFullName(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">الدولة<span class="text-red-500">*</span>:</label>
        <select
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
          value={country()}
          onInput={(e) => setCountry(e.target.value)}
        >
          <option value="">-- اختر الدولة --</option>
          <For each={countries}>
            {(countryName) => (
              <option value={countryName}>{countryName}</option>
            )}
          </For>
        </select>

        <label class="block mb-2 text-lg font-semibold text-gray-700">رقم الهاتف<span class="text-red-500">*</span>:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          type="tel"
          value={phoneNumber()}
          onInput={(e) => setPhoneNumber(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">البريد الإلكتروني<span class="text-red-500">*</span>:</label>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          type="email"
          value={email()}
          onInput={(e) => setEmail(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">وصف تفصيلي لما تريده في تطبيقك<span class="text-red-500">*</span>:</label>
        <textarea
          class="w-full h-32 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          value={description()}
          onInput={(e) => setDescription(e.target.value)}
        />

        <label class="block mb-2 text-lg font-semibold text-gray-700">اختر الباقة<span class="text-red-500">*</span>:</label>
        <select
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
          value={selectedPackageState()}
          onInput={(e) => setSelectedPackageState(e.target.value)}
        >
          <option value="">-- اختر الباقة --</option>
          <For each={packages}>
            {(pkg) => (
              <option value={pkg.value}>{pkg.label}</option>
            )}
          </For>
        </select>

        <label class="block mb-2 text-lg font-semibold text-gray-700">ملاحظات إضافية:</label>
        <textarea
          class="w-full h-24 p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          value={additionalNotes()}
          onInput={(e) => setAdditionalNotes(e.target.value)}
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

export default OrderYourAppForm;