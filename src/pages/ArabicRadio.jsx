import { useNavigate } from '@solidjs/router';
import { createSignal, For, Show, onCleanup, createMemo } from 'solid-js';

function ArabicRadio() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [selectedStation, setSelectedStation] = createSignal('');
  const [currentStation, setCurrentStation] = createSignal(null);
  const [audioPlayer, setAudioPlayer] = createSignal(null);

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
    // مصر - Egypt
    { name: 'نجوم إف إم', url: 'http://streams.nogoumfm.net:8000/nogoumfm', countryCode: 'EG' },
    { name: 'راديو مصر', url: 'http://radios.mytvradio.net:8000/radiomasr', countryCode: 'EG' },

    // السعودية - Saudi Arabia
    { name: 'إذاعة القرآن الكريم', url: 'http://live.mp3quran.net:8006/;', countryCode: 'SA' },
    { name: 'روتانا إف إم', url: 'http://live.rotana.net/fm', countryCode: 'SA' },

    // الإمارات - UAE
    { name: 'العربية FM', url: 'http://streaming.radioarabia.ae/;', countryCode: 'AE' },
    { name: 'إمارات FM', url: 'http://emaratfm.elmonzergroup.com:8000/;', countryCode: 'AE' },

    // الكويت - Kuwait
    { name: 'مارينا إف إم', url: 'http://live.marinafm.com:8000/marina', countryCode: 'KW' },

    // قطر - Qatar
    { name: 'راديو قطر', url: 'http://qtarradio.myradiostream.com/;', countryCode: 'QA' },

    // عمان - Oman
    { name: 'إذاعة سلطنة عمان', url: 'http://omanradio.omg.om:8000/;', countryCode: 'OM' },

    // البحرين - Bahrain
    { name: 'راديو البحرين', url: 'http://live.radiobahrainfm.com:8000/;', countryCode: 'BH' },

    // الأردن - Jordan
    { name: 'هلا إف إم', url: 'http://amman.jo:8000/hala', countryCode: 'JO' },

    // لبنان - Lebanon
    { name: 'صوت لبنان', url: 'http://radioliban.france:8000/;', countryCode: 'LB' },
    { name: 'إذاعة لبنان', url: 'http://icecast.ifrance.com/iradioliban', countryCode: 'LB' },

    // سوريا - Syria
    { name: 'شام إف إم', url: 'http://ninarfm.myradiostream.com/;", countryCode: 'SY' },

    // العراق - Iraq
    { name: 'راديو الناس', url: 'http://radionas.mediacast.com.au:8000/;', countryCode: 'IQ' },

    // اليمن - Yemen
    { name: 'إذاعة عدن', url: 'http://adenradio.yemen.net.ye:8000/;', countryCode: 'YE' },

    // ليبيا - Libya
    { name: 'راديو ليبيا الوطنية', url: 'http://streaming.libya.ly:8000/;', countryCode: 'LY' },

    // تونس - Tunisia
    { name: 'موزاييك إف إم', url: 'http://radio.mosaiquefm.net:8000/mosalive', countryCode: 'TN' },

    // الجزائر - Algeria
    { name: 'الشباب إف إم', url: 'http://webradio.tda.dz:8001/Chaine1_64K.mp3', countryCode: 'DZ' },

    // المغرب - Morocco
    { name: 'ميد راديو', url: 'http://broadcast.infomaniak.net:80/medradio-high.mp3', countryCode: 'MA' },

    // السودان - Sudan
    { name: 'إذاعة السودان', url: 'http://www.sudanradio.info:8000/;stream.mp3', countryCode: 'SD' },

    // فلسطين - Palestine
    { name: 'راديو أجيال', url: 'http://astream.agiatv.com:8000/;', countryCode: 'PS' },

    // موريتانيا - Mauritania
    { name: 'إذاعة موريتانيا', url: 'http://radiomauritanie.mr:8000/stream', countryCode: 'MR' },

    // الصومال - Somalia
    { name: 'راديو مقديشو', url: 'http://radiosomalifm.com:8000/;', countryCode: 'SO' },

    // جيبوتي - Djibouti
    { name: 'راديو جيبوتي', url: 'http://djiboutiradio.org:8000/;', countryCode: 'DJ' },

    // جزر القمر - Comoros
    { name: 'راديو جزر القمر', url: 'http://comorosradio.com:8000/;', countryCode: 'KM' },
  ];

  const filteredStations = createMemo(() => {
    if (selectedCountry() === '') {
      return [];
    } else {
      return radioStations.filter((station) => station.countryCode === selectedCountry());
    }
  });

  const playStation = () => {
    const station = filteredStations().find(s => s.name === selectedStation());
    if (!station) return;

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
      setSelectedStation('');
    }
  };

  onCleanup(() => {
    if (audioPlayer()) {
      audioPlayer().pause();
    }
  });

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
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
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none cursor-pointer box-border"
          onInput={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedStation('');
            stopStation();
          }}
          value={selectedCountry()}
        >
          <option value="">-- اختر الدولة --</option>
          <For each={arabCountries}>
            {(country) => (
              <option value={country.code}>{country.name}</option>
            )}
          </For>
        </select>
      </div>

      <Show when={selectedCountry()}>
        <div class="w-full max-w-md mb-4">
          <label class="block mb-2 text-lg font-semibold text-gray-700">اختر المحطة:</label>
          <select
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none cursor-pointer box-border"
            onInput={(e) => setSelectedStation(e.target.value)}
            value={selectedStation()}
          >
            <option value="">-- اختر المحطة --</option>
            <For each={filteredStations()}>
              {(station) => (
                <option value={station.name}>{station.name}</option>
              )}
            </For>
          </select>
        </div>
      </Show>

      <Show when={selectedStation()}>
        <button
          onClick={playStation}
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          استماع
        </button>
      </Show>

      <Show when={currentStation()}>
        <div class="mt-6 p-4 bg-purple-100 rounded-lg flex items-center justify-between w-full max-w-md">
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
  );
}

export default ArabicRadio;