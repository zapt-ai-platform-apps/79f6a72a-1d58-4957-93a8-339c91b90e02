import { useNavigate } from '@solidjs/router';
import { createSignal, For, Show, onCleanup } from 'solid-js';

function ArabicRadio() {
  const navigate = useNavigate();
  const [currentStation, setCurrentStation] = createSignal(null);
  const [audioPlayer, setAudioPlayer] = createSignal(null);

  const radioStations = [
    {
      name: 'إذاعة القرآن الكريم',
      url: 'http://live.mp3quran.net:8006/',
    },
    {
      name: 'راديو سوا',
      url: 'https://mbn-channel-01.akacast.akamaistream.net/7/861/19915/v1/ibb.akacast.akamaistream.net/mbn_channel_01',
    },
    {
      name: 'نجوم إف إم',
      url: 'http://188.40.135.197:8222/stream',
    },
    {
      name: 'مونت كارلو الدولية',
      url: 'http://montreal.kdptech.com:8026/stream',
    },
    // يمكنك إضافة المزيد من المحطات هنا
  ];

  const playStation = (station) => {
    if (audioPlayer()) {
      audioPlayer().pause();
    }

    const audio = new Audio(station.url);
    audio.play();
    setAudioPlayer(audio);
    setCurrentStation(station);
  };

  const stopStation = () => {
    if (audioPlayer()) {
      audioPlayer().pause();
      setAudioPlayer(null);
      setCurrentStation(null);
    }
  };

  onCleanup(() => {
    if (audioPlayer()) {
      audioPlayer().pause();
    }
  });

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الراديو العربي</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        اختر محطة إذاعية من القائمة أدناه واستمتع بالبث المباشر.
      </p>

      <div class="w-full max-w-md">
        <For each={radioStations}>
          {(station) => (
            <div class="flex items-center justify-between bg-white p-4 mb-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              <span class="text-lg font-semibold text-gray-800">{station.name}</span>
              <button
                onClick={() => playStation(station)}
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                استماع
              </button>
            </div>
          )}
        </For>
        <Show when={currentStation()}>
          <div class="mt-6 p-4 bg-purple-100 rounded-lg flex items-center justify-between">
            <span class="text-lg font-semibold text-purple-800">
              يتم الآن تشغيل: {currentStation().name}
            </span>
            <button
              onClick={stopStation}
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              إيقاف
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ArabicRadio;