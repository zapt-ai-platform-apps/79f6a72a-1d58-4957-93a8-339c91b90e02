import { createSignal, onMount } from 'solid-js';

function ArabicRadio() {
  const [stations, setStations] = createSignal([
    { name: 'إذاعة القرآن الكريم', url: 'http://stream.radiojar.com/ypn9ajg0tzqtv' },
    { name: 'راديو سوا', url: 'http://mbn-channel-01.ng.akacast.akamaistream.net/7/764/229923/v1/ibb.akacast.akamaistream.net/mbn_channel_01' },
    // يمكن إضافة المزيد من المحطات هنا
  ]);

  const [currentStationIndex, setCurrentStationIndex] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);

  let audioRef;

  onMount(() => {
    audioRef = new Audio();
    audioRef.src = stations()[currentStationIndex()].url;
  });

  const playStation = () => {
    audioRef.src = stations()[currentStationIndex()].url;
    audioRef.play();
    setIsPlaying(true);
  };

  const pauseStation = () => {
    audioRef.pause();
    setIsPlaying(false);
  };

  const nextStation = () => {
    setCurrentStationIndex((currentStationIndex() + 1) % stations().length);
    playStation();
  };

  const prevStation = () => {
    setCurrentStationIndex(
      (currentStationIndex() - 1 + stations().length) % stations().length
    );
    playStation();
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pb-16">
      <button
        onClick={() => window.history.back()}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">الراديو العربي</h2>

      <div class="w-full max-w-md text-center space-y-4">
        <h3 class="text-2xl font-semibold">{stations()[currentStationIndex()].name}</h3>
        <div class="flex justify-center space-x-4">
          <button
            onClick={prevStation}
            class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            ◀️ المحطة السابقة
          </button>
          <button
            onClick={isPlaying() ? pauseStation : playStation}
            class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            {isPlaying() ? '⏸️ إيقاف' : '▶️ تشغيل'}
          </button>
          <button
            onClick={nextStation}
            class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            المحطة التالية ▶️
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArabicRadio;