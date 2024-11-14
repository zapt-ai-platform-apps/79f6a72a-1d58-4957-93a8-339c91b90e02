import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ImageDescriber() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = createSignal(null);
  const [description, setDescription] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
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

  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800">
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
          onChange={handleImageUpload}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
        />
        <button
          onClick={handleDescribeImage}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() || !imageFile() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading() || !imageFile()}
        >
          {isLoading() ? 'جاري التحميل...' : 'وصف الصورة'}
        </button>
        <Show when={description()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <p class="text-lg text-gray-700">{description()}</p>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ImageDescriber;