import { useNavigate } from '@solidjs/router';
import { createSignal, createEffect, For, Show } from 'solid-js';

function RadioPlayer() {
  const navigate = useNavigate();

  const countries = [
    { name: 'مصر', code: 'EG' },
    { name: 'السعودية', code: 'SA' },
    { name: 'الإمارات', code: 'AE' },
    { name: 'المغرب', code: 'MA' },
    { name: 'الجزائر', code: 'DZ' },
    { name: 'تونس', code: 'TN' },
    { name: 'العراق', code: 'IQ' },
    { name: 'الأردن', code: 'JO' },
    { name: 'الكويت', code: 'KW' },
    { name: 'قطر', code: 'QA' },
    { name: 'البحرين', code: 'BH' },
    { name: 'عمان', code: 'OM' },
    { name: 'اليمن', code: 'YE' },
    { name: 'سوريا', code: 'SY' },
    { name: 'لبنان', code: 'LB' },
    { name: 'ليبيا', code: 'LY' },
    { name: 'السودان', code: 'SD' },
    { name: 'فلسطين', code: 'PS' },
    { name: 'موريتانيا', code: 'MR' },
    { name: 'جيبوتي', code: 'DJ' },
    { name: 'الصومال', code: 'SO' },
    { name: 'جزر القمر', code: 'KM' },
  ];

  const stationsData = {
    'EG': [
      { name: 'نجوم إف إم', url: 'https://streaming.naghamfm.net/naghamfm' },
      { name: 'إذاعة القرآن الكريم', url: 'http://www.qurankareemradio.net:9890/;' },
      { name: 'راديو 9090', url: 'http://9090streaming.mobtada.com/9090FMEGYPT' },
    ],
    'SA': [
      { name: 'إذاعة الرياض', url: 'http://live.shadiplanet.com:9124/;' },
      { name: 'إذاعة جدة', url: 'http://player.live-streamer.com:8030/;' },
      { name: 'إذاعة القرآن الكريم', url: 'http://n0d.radiojar.com/3h9g4r7g4tzuv' },
    ],
    // أضف المزيد من الدول ومحطاتها هنا...
  };

  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [stations, setStations] = createSignal([]);
  const [selectedStationIndex, setSelectedStationIndex] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [audio, setAudio] = createSignal(null);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    const uniqueStations = stationsData[countryCode] ? Array.from(new Set(stationsData[countryCode].map(JSON.stringify))).map(JSON.parse) : [];
    setStations(uniqueStations);
    setSelectedStationIndex(0);
    stopAudio();
  };

  const handleStationChange = (e) => {
    setSelectedStationIndex(parseInt(e.target.value));
    stopAudio();
  };

  const playAudio = () => {
    const currentStation = stations()[selectedStationIndex()];
    if (currentStation) {
      const newAudio = new Audio(currentStation.url);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audio()) {
      audio().pause();
      audio().currentTime = 0;
      setAudio(null);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying()) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  const nextStation = () => {
    stopAudio();
    setSelectedStationIndex((prevIndex) => (prevIndex + 1) % stations().length);
    playAudio();
  };

  const previousStation = () => {
    stopAudio();
    setSelectedStationIndex((prevIndex) => (prevIndex - 1 + stations().length) % stations().length);
    playAudio();
  };

  createEffect(() => {
    // إيقاف تشغيل الصوت عند إلغاء تحميل المكون
    return () => {
      stopAudio();
    };
  });

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الاستماع للراديو العربي</h1>

      <div class="w-full max-w-md">
        <div class="mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">اختر الدولة:</label>
          <select
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
            value={selectedCountry()}
            onInput={handleCountryChange}
          >
            <option value="">-- اختر الدولة --</option>
            <For each={countries}>
              {(country) => (
                <option value={country.code}>{country.name}</option>
              )}
            </For>
          </select>
        </div>

        <Show when={stations().length > 0}>
          <div class="mb-4">
            <label class="block mb-2 text-lg font-semibold text-gray-700">اختر المحطة:</label>
            <select
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
              value={selectedStationIndex()}
              onInput={handleStationChange}
            >
              <For each={stations()}>
                {(station, index) => (
                  <option value={index}>{station.name}</option>
                )}
              </For>
            </select>
          </div>

          <div class="flex items-center justify-center space-x-reverse space-x-4 mt-6">
            <button
              onClick={previousStation}
              class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              ⏮️ السابق
            </button>
            <button
              onClick={togglePlayPause}
              class="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              {isPlaying() ? '⏸️ إيقاف' : '▶️ تشغيل'}
            </button>
            <button
              onClick={nextStation}
              class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              ⏭️ التالي
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default RadioPlayer;