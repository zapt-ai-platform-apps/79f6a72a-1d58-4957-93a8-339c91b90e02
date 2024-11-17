import { useNavigate } from '@solidjs/router';
import { createSignal, For, Show, onCleanup, createMemo } from 'solid-js';

function ArabicRadio() {
  const navigate = useNavigate();
  const [currentStation, setCurrentStation] = createSignal(null);
  const [audioPlayer, setAudioPlayer] = createSignal(null);
  const [selectedCountry, setSelectedCountry] = createSignal('');

  const arabCountries = [
    { code: 'EG', name: 'مصر' },
    { code: 'SA', name: 'السعودية' },
    { code: 'AE', name: 'الإمارات' },
    { code: 'KW', name: 'الكويت' },
    { code: 'QA', name: 'قطر' },
    { code: 'OM', name: 'عمان' },
    { code: 'BH', name: 'البحرين' },
    { code: 'JO', name: 'الأردن' },
    { code: 'LB', name: 'لبنان' },
    { code: 'SY', name: 'سوريا' },
    { code: 'IQ', name: 'العراق' },
    { code: 'YE', name: 'اليمن' },
    { code: 'LY', name: 'ليبيا' },
    { code: 'TN', name: 'تونس' },
    { code: 'DZ', name: 'الجزائر' },
    { code: 'MA', name: 'المغرب' },
    { code: 'SD', name: 'السودان' },
    { code: 'PS', name: 'فلسطين' },
    { code: 'MR', name: 'موريتانيا' },
    { code: 'SO', name: 'الصومال' },
    { code: 'DJ', name: 'جيبوتي' },
    { code: 'KM', name: 'جزر القمر' },
  ];

  const radioStations = [
    // مصر
    {
      name: 'نجوم إف إم',
      url: 'http://streaming.nagume.net:8000/;',
      countryCode: 'EG',
    },
    {
      name: 'راديو مصر',
      url: 'http://radios.mytv-online.com:8000/RadioMasr',
      countryCode: 'EG',
    },
    // السعودية
    {
      name: 'إذاعة القرآن الكريم',
      url: 'http://live.mp3quran.net:8006/',
      countryCode: 'SA',
    },
    {
      name: 'روتانا إف إم',
      url: 'http://live.rotana.net/fm',
      countryCode: 'SA',
    },
    // الإمارات
    {
      name: 'راديو سوا',
      url: 'https://streaming.radiosawa.com/stream',
      countryCode: 'AE',
    },
    {
      name: 'الخليجية إف إم',
      url: 'http://broadcast.infomaniak.network/defjam/grooves',
      countryCode: 'AE',
    },
    // لبنان
    {
      name: 'مونت كارلو الدولية',
      url: 'http://live.mc-doualiya.com/mc-doualiya',
      countryCode: 'LB',
    },
    {
      name: 'راديو وان',
      url: 'http://38.97.225.67:8800/;',
      countryCode: 'LB',
    },
    // الأردن
    {
      name: 'حسنى إف إم',
      url: 'http://streaming.husnafm.com:7001/;',
      countryCode: 'JO',
    },
    // الكويت
    {
      name: 'مارينا إف إم',
      url: 'http://sp1.mjstream.eu:9300/;',
      countryCode: 'KW',
    },
    // قطر
    {
      name: 'QF Radio',
      url: 'http://212.77.203.199:8002/;',
      countryCode: 'QA',
    },
    // عمان
    {
      name: 'إذاعة سلطنة عمان العامة',
      url: 'http://oc.ch2.orange.jo:8080/omanradio',
      countryCode: 'OM',
    },
    // البحرين
    {
      name: 'راديو البحرين',
      url: 'http://live.radio99.net:8000/;stream.mp3',
      countryCode: 'BH',
    },
    // سوريا
    {
      name: 'شام إف إم',
      url: 'http://188.165.226.82:8000/;stream.mp3',
      countryCode: 'SY',
    },
    // العراق
    {
      name: 'راديو سوا العراق',
      url: 'https://streaming.radiosawa.com/iraq',
      countryCode: 'IQ',
    },
    // اليمن
    {
      name: 'إذاعة عدن',
      url: 'http://streaming.inet4server.com:8000/;stream.mp3',
      countryCode: 'YE',
    },
    // ليبيا
    {
      name: 'راديو ليبيا',
      url: 'http://176.9.181.94:8010/;stream.mp3',
      countryCode: 'LY',
    },
    // تونس
    {
      name: 'موزاييك إف إم',
      url: 'http://radio.mosaiquefm.net:8000/mosalive',
      countryCode: 'TN',
    },
    // الجزائر
    {
      name: 'الشباب إف إم',
      url: 'http://webradio.tda.dz:8001/Chaine1_64K.mp3',
      countryCode: 'DZ',
    },
    // المغرب
    {
      name: 'ميد راديو',
      url: 'http://broadcast.infomaniak.net:80/medradio-high.mp3',
      countryCode: 'MA',
    },
    // السودان
    {
      name: 'إذاعة السودان',
      url: 'http://www.sudanradio.info:8000/;stream.mp3',
      countryCode: 'SD',
    },
    // فلسطين
    {
      name: 'راديو أجيال',
      url: 'http://astream.agiatv.com:8000/;stream.mp3',
      countryCode: 'PS',
    },
    // موريتانيا
    {
      name: 'إذاعة موريتانيا',
      url: 'http://radiomauritanie.net:8000/;stream.mp3',
      countryCode: 'MR',
    },
    // الصومال
    {
      name: 'راديو مقديشو',
      url: 'http://198.178.123.14:8000/;stream.mp3',
      countryCode: 'SO',
    },
    // جيبوتي
    {
      name: 'صوت من لا صوت له FM',
      url: 'http://142.44.137.158:8269/;stream.mp3',
      countryCode: 'DJ',
    },
    // جزر القمر
    {
      name: 'إذاعة جزر القمر',
      url: 'http://stream.comorosradio.com/;stream.mp3',
      countryCode: 'KM',
    },
  ];

  const filteredStations = createMemo(() => {
    if (selectedCountry() === '') {
      return radioStations;
    } else {
      return radioStations.filter((station) => station.countryCode === selectedCountry());
    }
  });

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
        اختر الدولة ثم المحطة الإذاعية للاستماع إلى البث المباشر.
      </p>

      <div class="w-full max-w-md mb-4">
        <label class="block mb-2 text-lg font-semibold text-gray-700">اختر الدولة:</label>
        <select
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none cursor-pointer"
          onInput={(e) => setSelectedCountry(e.target.value)}
          value={selectedCountry()}
        >
          <option value="">-- كل الدول --</option>
          <For each={arabCountries}>
            {(country) => (
              <option value={country.code}>{country.name}</option>
            )}
          </For>
        </select>
      </div>

      <div class="w-full max-w-md">
        <For each={filteredStations()}>
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
        <Show when={filteredStations().length === 0}>
          <p class="text-center text-gray-600 mt-4">لا توجد محطات متاحة لهذه الدولة.</p>
        </Show>
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