import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';

function ImageTextExtractor() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = createSignal(null);
  const [extractedText, setExtractedText] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleExtractText = async () => {
    if (!selectedImage()) return;
    setIsLoading(true);
    try {
      const base64Image = await getBase64(selectedImage());
      const base64Data = base64Image.split(',')[1];

      const response = await fetch('/api/extractTextFromImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data }),
      });
      if (response.ok) {
        const data = await response.json();
        setExtractedText(data.text);
      } else {
        console.error('Error extracting text');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
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
      <h2 class="text-3xl font-bold text-purple-600 mb-6">استخراج النص من الصورة</h2>
      <div class="w-full max-w-2xl space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
        />
        <button
          onClick={handleExtractText}
          class={`w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isLoading() || !selectedImage() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading() || !selectedImage()}
        >
          {isLoading() ? 'جاري استخراج النص...' : 'استخراج النص'}
        </button>
        <Show when={extractedText()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <p class="prose prose-lg text-gray-700 whitespace-pre-wrap">{extractedText()}</p>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ImageTextExtractor;