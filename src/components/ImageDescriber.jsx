import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ImageDescriber() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = createSignal(null);
  const [imagePreview, setImagePreview] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('حجم الصورة أكبر من 4 ميجابايت.');
      return;
    }
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const describeImage = async () => {
    if (!imageFile()) return;
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        const response = await fetch('/api/describeImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData: base64String }),
        });
        if (response.ok) {
          const data = await response.json();
          setDescription(data.description);
        } else {
          console.error('Error from describeImage API:', response.statusText);
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(imageFile());
    } catch (error) {
      console.error('Error describing image:', error);
      setIsLoading(false);
    }
  };

  const copyDescription = () => {
    navigator.clipboard.writeText(description())
      .then(() => {
        alert('تم نسخ الوصف إلى الحافظة');
      })
      .catch(err => {
        console.error('Error copying description:', err);
      });
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">وصف الصور باستخدام الذكاء الاصطناعي</h2>

      <div class="w-full max-w-2xl space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
        />

        <Show when={imagePreview()}>
          <img src={imagePreview()} alt="معاينة الصورة" class="w-full rounded-lg shadow-md" />
        </Show>

        <button
          onClick={describeImage}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() || !imageFile() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading() || !imageFile()}
        >
          {isLoading() ? 'جاري تحميل الوصف' : 'وصف الصورة'}
        </button>

        <Show when={isLoading()}>
          <p class="text-center text-gray-600">جاري تحميل الوصف...</p>
        </Show>

        <Show when={description()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <p class="text-gray-700">{description()}</p>
            <button
              onClick={copyDescription}
              class="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              نسخ الوصف
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ImageDescriber;