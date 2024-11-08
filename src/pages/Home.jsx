import { useNavigate } from '@solidjs/router';

function Home() {
  const navigate = useNavigate();

  return (
    <div class="flex flex-col items-center justify-center min-h-screen p-4" dir="rtl">
      <img src="https://images.unsplash.com/photo-1594321120022-7649850959bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw4fHxBcHAlMjBpY29uJTIwcmVwcmVzZW50aW5nJTIwYWNjZXNzaWJpbGl0eSUyMGZvciUyMHRoZSUyMGJsaW5kfGVufDB8fHx8MTczMTAyOTM4N3ww&ixlib=rb-4.0.3&q=80&w=1080"  alt="Blind Accessibility Icon" data-image-request="App icon representing accessibility for the blind" class="w-24 h-24 mb-4" />
      <h1 class="text-4xl font-bold text-purple-600 mb-4">Blind Accessibility</h1>
      <p class="text-xl text-gray-700 text-center max-w-md mb-8">
        نوفر مجموعة شاملة من الأدوات والموارد لتعزيز الوصول الرقمي للأشخاص المكفوفين وضعاف البصر.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => navigate('/assistant')}
          class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          المساعد الصوتي
        </button>
        <button
          onClick={() => navigate('/editor')}
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          محرر النصوص الذكي
        </button>
        <button
          onClick={() => navigate('/radio')}
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          الراديو العربي
        </button>
      </div>
    </div>
  );
}

export default Home;