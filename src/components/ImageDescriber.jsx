import { createSignal, Show, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ImageDescriber() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = createSignal(null);
  const [imagePreview, setImagePreview] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 4 * 1024 * 1024) { // Check if file size is less than or equal to 4MB
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('الرجاء اختيار صورة لا يزيد حجمها عن 4 ميجابايت.');
      setImageFile(null);
      setImagePreview('');
    }
  };

  const handleDescribeImage = async () => {
    if (!imageFile()) return;
    setIsLoading(true);
    try {
      // Read the file as base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1]; // Remove data:image/*;base64,
        // Make API call to backend
        const response = await fetch('/api/describeImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData: base64Image }),
        });
        if (response.ok) {
          const data = await response.json();
          setDescription(data.description);
        } else {
          console.error('Error describing image:', response.statusText);
          alert('حدث خطأ أثناء وصف الصورة. يرجى المحاولة مرة أخرى.');
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(imageFile());
    } catch (error) {
      console.error('Error describing image:', error);
      alert('حدث خطأ أثناء وصف الصورة. يرجى المحاولة مرة أخرى.');
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
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة إلى الصفحة الرئيسية"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">وصف الصور باستخدام الذكاء الاصطناعي</h2>

      <div class="w-full max-w-2xl space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
          aria-label="تحميل صورة"
        />

        <Show when={imagePreview()}>
          <div class="mt-4">
            <img src={imagePreview()} alt="صورة تم تحميلها" class="w-full max-h-96 object-contain rounded-lg shadow-md" />
          </div>
        </Show>

        <button
          onClick={handleDescribeImage}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() || !imageFile() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading() || !imageFile()}
          aria-label="وصف الصورة"
        >
          {isLoading() ? 'جاري التحميل...' : 'وصف الصورة'}
        </button>

        <Show when={description()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <p class="text-lg text-gray-700">{description()}</p>
          </div>
          <div class="mt-2 flex flex-wrap gap-4">
            <button
              onClick={copyDescription}
              class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              aria-label="نسخ الوصف"
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