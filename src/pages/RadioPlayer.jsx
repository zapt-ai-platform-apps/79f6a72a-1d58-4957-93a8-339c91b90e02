import { useNavigate } from '@solidjs/router';
import { createSignal, onCleanup, For, Show } from 'solid-js';

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
      { name: 'إذاعة القرآن الكريم', url: 'http://www.quran-radio.org:8000/;' },
      { name: 'راديو مصر', url: 'http://www.radiosonline.cl/radio/radios-malaya-espejo' },
      { name: 'راديو نجوم إف إم', url: 'http://62.241.160.194:8000/;' },
    ],
    'SA': [
      { name: 'إذاعة القرآن الكريم', url: 'http://quran.saudi/stream' },
      { name: 'إذاعة نداء الإسلام', url: 'http://nedaalislam.com.sa:8080/stream' },
    ],
    'AE': [
      { name: 'إذاعة القرآن الكريم أبو ظبي', url: 'http://icecast.abudhabi-cdn.com/quran.aac' },
      { name: 'إذاعة نور دبي', url: 'http://icecast.dmcradio.ae/noor108.aac' },
    ],
    // أضف المزيد من الدول والمحطات حسب الحاجة
  };

  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [stations, setStations] = createSignal([]);
  const [selectedStationIndex, setSelectedStationIndex] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [audio, setAudio] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(null);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    const uniqueStations = stationsData[countryCode]
      ? stationsData[countryCode]
      : [];
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
      stopAudio(); // Stop any current audio before starting new one
      setLoading(true);
      setError(null);
      const newAudio = new Audio(currentStation.url);

      newAudio.addEventListener('canplay', () => {
        setLoading(false);
        newAudio.play();
        setAudio(newAudio);
        setIsPlaying(true);
      });

      newAudio.addEventListener('error', (e) => {
        console.error('Audio Error:', e);
        setLoading(false);
        setError('حدث خطأ أثناء تشغيل المحطة. حاول مرة أخرى لاحقاً.');
        setIsPlaying(false);
      });

      setAudio(newAudio);
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
    setSelectedStationIndex((prevIndex) =>
      (prevIndex + 1) % stations().length
    );
    playAudio();
  };

  const previousStation = () => {
    stopAudio();
    setSelectedStationIndex((prevIndex) =>
      (prevIndex - 1 + stations().length) % stations().length
    );
    playAudio();
  };

  onCleanup(() => {
    stopAudio();
  });

  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="العودة"
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
                  <option value={index()}>{station.name}</option>
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
              class={`px-6 py-3 ${
                isPlaying() ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
              disabled={loading()}
            >
              <Show when={!loading()} fallback="جاري التحميل...">
                {isPlaying() ? '⏸️ إيقاف' : '▶️ تشغيل'}
              </Show>
            </button>
            <button
              onClick={nextStation}
              class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              ⏭️ التالي
            </button>
          </div>
        </Show>

        <Show when={error()}>
          <div class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error()}
          </div>
        </Show>
      </div>
    </div>
  );
}

export default RadioPlayer;