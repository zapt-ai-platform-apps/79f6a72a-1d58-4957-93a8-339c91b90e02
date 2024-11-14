import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ImageDescriber() {
  const navigate = useNavigate();
  const [imageData, setImageData] = createSignal(null);
  const [description, setDescription] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 4 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescribeImage = async () => {
    if (!imageData()) return;
    setIsLoading(true);
    try {
      const base64Image = imageData().split(',')[1];
      const response = await fetch('/api/describeImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData: base64Image })
      });
      const data = await response.json();
      if (response.ok) {
        setDescription(data.description);
      } else {
        alert('حدث خطأ أثناء وصف الصورة.');
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error describing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyDescription = () => {
    navigator.clipboard.writeText(description())
      .then(() => {
        alert('تم نسخ الوصف إلى الحافظة');
      })
      .catch(err => {
        console.error('Error copying content:', err);
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
          onChange={handleFileChange}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
        />

        <Show when={imageData()}>
          <div class="mt-4">
            <img src={imageData()} alt="معاينة الصورة" class="w-full rounded-lg shadow-md" />
          </div>
        </Show>

        <button
          onClick={handleDescribeImage}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() || !imageData() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading() || !imageData()}
        >
          {isLoading() ? 'جاري التحميل...' : 'وصف الصورة'}
        </button>

        <Show when={description()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <p class="text-gray-700">{description()}</p>
          </div>
          <div class="mt-2">
            <button
              onClick={copyDescription}
              class="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
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