import { createSignal, onMount, Show, For } from 'solid-js';

function ArabRadio(props) {
  const [loading, setLoading] = createSignal(false);
  const [countries, setCountries] = createSignal([]);
  const [selectedCountry, setSelectedCountry] = createSignal(null);
  const [stations, setStations] = createSignal([]);
  const [selectedStation, setSelectedStation] = createSignal(null);
  const [playing, setPlaying] = createSignal(false);

  let audioRef;

  const arabCountries = [
    { en: 'Algeria', ar: 'الجزائر' },
    { en: 'Bahrain', ar: 'البحرين' },
    { en: 'Comoros', ar: 'جزر القمر' },
    { en: 'Djibouti', ar: 'جيبوتي' },
    { en: 'Egypt', ar: 'مصر' },
    { en: 'Iraq', ar: 'العراق' },
    { en: 'Jordan', ar: 'الأردن' },
    { en: 'Kuwait', ar: 'الكويت' },
    { en: 'Lebanon', ar: 'لبنان' },
    { en: 'Libya', ar: 'ليبيا' },
    { en: 'Mauritania', ar: 'موريتانيا' },
    { en: 'Morocco', ar: 'المغرب' },
    { en: 'Oman', ar: 'عمان' },
    { en: 'Palestine', ar: 'فلسطين' },
    { en: 'Qatar', ar: 'قطر' },
    { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    { en: 'Somalia', ar: 'الصومال' },
    { en: 'Sudan', ar: 'السودان' },
    { en: 'Syria', ar: 'سوريا' },
    { en: 'Tunisia', ar: 'تونس' },
    { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    { en: 'Yemen', ar: 'اليمن' },
  ];

  onMount(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/countries');
      const data = await response.json();
      const arabCountryNames = arabCountries.map(country => country.en);
      const filteredCountries = data.filter(country => arabCountryNames.includes(country.name));
      // Map to include Arabic name
      const mappedCountries = filteredCountries.map(country => {
        const arName = arabCountries.find(c => c.en === country.name)?.ar || country.name;
        return { ...country, arName };
      });
      setCountries(mappedCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  });

  const fetchStations = async (countryName) => {
    setLoading(true);
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(countryName)}`);
      const data = await response.json();
      // Remove duplicate stations by name or URL
      const seen = new Set();
      const uniqueStations = data.filter(station => {
        const key = station.name + station.url;
        if (seen.has(key)) {
          return false;
        } else {
          seen.add(key);
          return true;
        }
      });
      setStations(uniqueStations);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    fetchStations(country.name);
  };

  const playStation = (station) => {
    setSelectedStation(station);
    setPlaying(true);
    if (audioRef) {
      audioRef.src = station.url_resolved;
      audioRef.play();
    }
  };

  const stopPlaying = () => {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    setPlaying(false);
    setSelectedStation(null);
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-800" dir="rtl">
      <div class="w-full max-w-md md:max-w-lg lg:max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-purple-600">الراديو العربي</h2>
          <button
            onClick={props.onClose}
            class="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out cursor-pointer"
            aria-label="إغلاق"
          >
            ✖️
          </button>
        </div>
        <Show when={!selectedCountry()}>
          <div>
            <h3 class="text-xl font-bold mb-2 text-purple-600">اختر دولة:</h3>
            <Show when={loading()}>
              <p>جاري التحميل...</p>
            </Show>
            <Show when={!loading()}>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                <For each={countries()}>
                  {(country) => (
                    <button
                      onClick={() => selectCountry(country)}
                      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      {country.arName}
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </Show>
        <Show when={selectedCountry()}>
          <div>
            <button
              onClick={() => {
                setSelectedCountry(null);
                setStations([]);
                setSelectedStation(null);
              }}
              class="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              العودة إلى قائمة الدول
            </button>
            <h3 class="text-xl font-bold mb-2 text-purple-600">اختر محطة من {selectedCountry().arName}:</h3>
            <Show when={loading()}>
              <p>جاري التحميل...</p>
            </Show>
            <Show when={!loading()}>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                <For each={stations()}>
                  {(station) => (
                    <button
                      onClick={() => playStation(station)}
                      class="text-left px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      {station.name}
                    </button>
                  )}
                </For>
              </div>
            </Show>
            <Show when={playing() && selectedStation()}>
              <div class="mt-4">
                <h4 class="text-lg font-bold text-purple-600">تشغيل: {selectedStation().name}</h4>
                <audio
                  ref={(el) => (audioRef = el)}
                  controls
                  autoplay
                  src={selectedStation().url_resolved}
                  class="w-full mt-2"
                  onEnded={() => setPlaying(false)}
                ></audio>
                <button
                  onClick={stopPlaying}
                  class="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  إيقاف التشغيل
                </button>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ArabRadio;