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
    { name: 'نايل إف إم', url: 'http://196.221.69.74:8000/nilefm', countryCode: 'EG' },
    { name: 'ميجا إف إم', url: 'http://5.189.168.68:8000/mega', countryCode: 'EG' },
    { name: 'راديو مصر', url: 'http://radios.mytvradio.net:8000/radiomasr', countryCode: 'EG' },
    { name: 'راديو الشرق الأوسط', url: 'http://95.217.203.147:8000/stream', countryCode: 'EG' },
    { name: 'راديو 9090', url: 'http://188.40.98.145:8000/9090', countryCode: 'EG' },

    // السعودية - Saudi Arabia
    { name: 'إذاعة القرآن الكريم', url: 'http://live.mp3quran.net:8006/;', countryCode: 'SA' },
    { name: 'روتانا إف إم', url: 'http://live.rotana.net/fm', countryCode: 'SA' },
    { name: 'مكس إف إم', url: 'http://uk4.internet-radio.com:8000/;stream', countryCode: 'SA' },
    { name: 'يو إف إم', url: 'http://37.59.28.208:8198/stream', countryCode: 'SA' },
    { name: 'إذاعة جدة', url: 'http://s2.voscast.com:10676/;', countryCode: 'SA' },

    // الإمارات - UAE
    { name: 'العربية FM', url: 'http://streaming.radioarabia.ae/;', countryCode: 'AE' },
    { name: 'إمارات FM', url: 'http://emaratfm.elmonzergroup.com:8000/;', countryCode: 'AE' },
    { name: 'نجوم إف إم الإمارات', url: 'http://151.80.97.68:8000/nogoumfmea', countryCode: 'AE' },
    { name: 'راديو الرابعة', url: 'http://streamer.radioalrabea.net:8000/RadioAlrabeaFM', countryCode: 'AE' },
    { name: 'شعبيات FM', url: 'http://144.217.203.184:9980/stream', countryCode: 'AE' },

    // الكويت - Kuwait
    { name: 'مارينا إف إم', url: 'http://live.marinafm.com:8000/marina', countryCode: 'KW' },
    { name: 'كويت FM', url: 'http://162.244.80.131:10002/;', countryCode: 'KW' },
    { name: 'نبض الكويت', url: 'http://streaming.nabdhalkuwait.com:80/;', countryCode: 'KW' },
    { name: 'أويسس إف إم', url: 'http://astra-out.apex.radio:80/proxy/ofo?mp=/stream', countryCode: 'KW' },

    // قطر - Qatar
    { name: 'راديو قطر', url: 'http://qtarradio.myradiostream.com/;', countryCode: 'QA' },
    { name: 'إذاعة القرآن الكريم قطر', url: 'http://quraan.euradio.fr:9500/;', countryCode: 'QA' },
    { name: 'صوت الخليج', url: 'http://173.192.105.231:3548/;', countryCode: 'QA' },
    { name: 'مونت كارلو الدولية', url: 'http://live02.rfi.fr/rfimonde-96k.mp3', countryCode: 'QA' },

    // عمان - Oman
    { name: 'إذاعة سلطنة عمان', url: 'http://omanradio.omg.om:8000/;', countryCode: 'OM' },
    { name: 'هلا إف إم عمان', url: 'http://live.halaoman.fm:8000/;stream', countryCode: 'OM' },
    { name: 'الشباب FM', url: 'http://media.tvr.om:8000/olo_has', countryCode: 'OM' },
    { name: 'إذاعة الشبيبة', url: 'http://stream.radiojar.com/shabiba', countryCode: 'OM' },

    // البحرين - Bahrain
    { name: 'راديو البحرين', url: 'http://live.radiobahrainfm.com:8000/;', countryCode: 'BH' },
    { name: 'بحرين إف إم', url: 'http://162.244.80.131:10020/;', countryCode: 'BH' },
    { name: 'بحرين راديو إنترناشونال', url: 'http://80.86.106.142:18000/;', countryCode: 'BH' },
    { name: 'هلا 96', url: 'http://stream.zenolive.com/ytg7hk0hp9duv', countryCode: 'BH' },

    // الأردن - Jordan
    { name: 'هلا إف إم', url: 'http://live.hala.jo:8888/;', countryCode: 'JO' },
    { name: 'مزاج إف إم', url: 'http://94.249.253.141:9128/;', countryCode: 'JO' },
    { name: 'راديو فن إف إم', url: 'http://188.247.86.15:8000/;', countryCode: 'JO' },
    { name: 'إذاعة القوات المسلحة', url: 'http://78.46.254.59:8000/stream', countryCode: 'JO' },

    // لبنان - Lebanon
    { name: 'صوت لبنان', url: 'http://198.178.123.17:7248/;stream.nsv', countryCode: 'LB' },
    { name: 'إذاعة لبنان', url: 'http://icecast.ifrance.com/iradioliban', countryCode: 'LB' },
    { name: 'نجوم إف إم لبنان', url: 'http://91.121.134.23:8000/;', countryCode: 'LB' },
    { name: 'جبل لبنان', url: 'http://jabalradio.ice.infomaniak.ch/jabalradio-128.mp3', countryCode: 'LB' },

    // سوريا - Syria
    { name: 'شام إف إم', url: 'http://ninarfm.myradiostream.com/;', countryCode: 'SY' },
    { name: 'نينار إف إم', url: 'http://5.189.142.165:8000/;', countryCode: 'SY' },
    { name: 'إذاعة سورية الغد', url: 'http://media.syriastream.com:8000/stream', countryCode: 'SY' },
    { name: 'المدينة إف إم', url: 'http://live.almedinafm.com:8888/;', countryCode: 'SY' },

    // العراق - Iraq
    { name: 'راديو الناس', url: 'http://radionas.mediacast.com.au:8000/;', countryCode: 'IQ' },
    { name: 'راديو دجلة', url: 'http://www.dijlah.iq:8000/;', countryCode: 'IQ' },
    { name: 'هلا إف إم العراق', url: 'http://streaming.zeno.fm/0ps4p3npxwzuv', countryCode: 'IQ' },
    { name: 'إذاعة بغداد', url: 'http://streamer.radio.co/s5c0730a86/listen', countryCode: 'IQ' },

    // اليمن - Yemen
    { name: 'إذاعة عدن', url: 'http://adenradio.yemen.net.ye:8000/;', countryCode: 'YE' },
    { name: 'إذاعة صنعاء', url: 'http://37.59.28.208:8106/stream', countryCode: 'YE' },
    { name: 'القرآن الكريم اليمن', url: 'http://yemenmedia.net:8000/quran', countryCode: 'YE' },
    { name: 'يمن إف إم', url: 'http://stream.zenolive.com/4ah5y7htkbrtv', countryCode: 'YE' },

    // ليبيا - Libya
    { name: 'راديو ليبيا الوطنية', url: 'http://streaming.libya.ly:8000/;', countryCode: 'LY' },
    { name: 'راديو الوسط', url: 'http://streaming.radiowasat.net:8000/;', countryCode: 'LY' },
    { name: 'راديو صوت ليبيا', url: 'http://s1.voscast.com:8762/;', countryCode: 'LY' },
    { name: 'ليبيا إف إم', url: 'http://streamer.radio.co/s75e3f0acd/listen', countryCode: 'LY' },

    // تونس - Tunisia
    { name: 'موزاييك إف إم', url: 'http://radio.mosaiquefm.net:8000/mosalive', countryCode: 'TN' },
    { name: 'شمس إف إم', url: 'http://stream8.tanitweb.com/shems', countryCode: 'TN' },
    { name: 'جوهرة إف إم', url: 'http://stream6.tanitweb.com/jawharafm', countryCode: 'TN' },
    { name: 'إكسبرس إف إم', url: 'http://expressfm.ice.infomaniak.ch/expressfm-64.mp3', countryCode: 'TN' },

    // الجزائر - Algeria
    { name: 'الشباب إف إم', url: 'http://webradio.tda.dz:8001/Chaine1_64K.mp3', countryCode: 'DZ' },
    { name: 'الشروق إف إم', url: 'http://webradio.tda.dz:8001/Chaine3_64K.mp3', countryCode: 'DZ' },
    { name: 'راديو جزائر', url: 'http://webradio.tda.dz:8001/Algerie24_64K.mp3', countryCode: 'DZ' },
    { name: 'جيل إف إم', url: 'http://webradio.tda.dz:8001/Jil_FM_64K.mp3', countryCode: 'DZ' },

    // المغرب - Morocco
    { name: 'ميد راديو', url: 'http://broadcast.infomaniak.net/medradio-high.mp3', countryCode: 'MA' },
    { name: 'شذى إف إم', url: 'http://5.135.194.225:8000/;', countryCode: 'MA' },
    { name: 'هيت راديو', url: 'http://6203.live.streamtheworld.com:80/HITRADIO113.mp3', countryCode: 'MA' },
    { name: 'محمد السادس للقرآن الكريم', url: 'http://radiomars.ice.infomaniak.ch/radiomars-128.mp3', countryCode: 'MA' },

    // السودان - Sudan
    { name: 'إذاعة السودان', url: 'http://www.sudanradio.info:8000/;stream.mp3', countryCode: 'SD' },
    { name: 'القرآن الكريم السودان', url: 'http://live.mp3quran.net:8006/;', countryCode: 'SD' },
    { name: 'طيبة إف إم', url: 'http://stream.zenolive.com/7r4h1c0hrbruv', countryCode: 'SD' },
    { name: 'راديو دبنقا', url: 'http://s3.voscast.com:8499/;', countryCode: 'SD' },

    // فلسطين - Palestine
    { name: 'راديو أجيال', url: 'http://astream.agiatv.com:8000/;', countryCode: 'PS' },
    { name: 'راديو فلسطين', url: 'http://streaming.radio.co/s5c0730a86/listen', countryCode: 'PS' },
    { name: 'إذاعة القرآن الكريم فلسطين', url: 'http://live.mp3quran.net:8006/;', countryCode: 'PS' },
    { name: 'راديو بيت لحم 2000', url: 'http://streaming.bethlehem2000.net:8000/radio', countryCode: 'PS' },

    // موريتانيا - Mauritania
    { name: 'إذاعة موريتانيا', url: 'http://radiomauritanie.mr:8000/stream', countryCode: 'MR' },
    { name: 'الإذاعة الثقافية', url: 'http://radiomauritanie.mr:8001/stream', countryCode: 'MR' },
    { name: 'هلا إف إم موريتانيا', url: 'http://5.39.71.159:8657/stream', countryCode: 'MR' },

    // الصومال - Somalia
    { name: 'راديو مقديشو', url: 'http://radiosomalifm.com:8000/;', countryCode: 'SO' },
    { name: 'راديو هيرجيسا', url: 'http://178.63.96.22:8000/stream', countryCode: 'SO' },
    { name: 'إذاعة القرآن الكريم الصومال', url: 'http://live.mp3quran.net:8006/;', countryCode: 'SO' },

    // جيبوتي - Djibouti
    { name: 'راديو جيبوتي', url: 'http://djiboutiradio.org:8000/;', countryCode: 'DJ' },
    { name: 'إذاعة صوت الخليج', url: 'http://stream.zenolive.com/3441yxjt5heuv', countryCode: 'DJ' },

    // جزر القمر - Comoros
    { name: 'راديو جزر القمر', url: 'http://comorosradio.com:8000/;', countryCode: 'KM' },
    { name: 'راديو القمر', url: 'http://198.27.88.67:8628/;', countryCode: 'KM' },
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