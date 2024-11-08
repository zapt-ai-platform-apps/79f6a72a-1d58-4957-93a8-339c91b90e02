import { createSignal, onMount, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ArabRadio() {
  const [loadingCountries, setLoadingCountries] = createSignal(false);
  const [loadingStations, setLoadingStations] = createSignal(false);
  const [countries, setCountries] = createSignal([]);
  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [stations, setStations] = createSignal([]);
  const [selectedStation, setSelectedStation] = createSignal('');
  const [playing, setPlaying] = createSignal(false);

  const navigate = useNavigate();
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
    setLoadingCountries(true);
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
      alert('حدث خطأ أثناء جلب قائمة الدول.');
    } finally {
      setLoadingCountries(false);
    }
  });

  const fetchStations = async (countryName) => {
    setLoadingStations(true);
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
      alert('حدث خطأ أثناء جلب قائمة المحطات.');
    } finally {
      setLoadingStations(false);
    }
  };

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    setSelectedStation('');
    setStations([]);
    if (selected) {
      const countryEnglishName = arabCountries.find(country => country.ar === selected)?.en || selected;
      fetchStations(countryEnglishName);
    }
  };

  const handleStationChange = (e) => {
    const selected = e.target.value;
    setSelectedStation(selected);
    setPlaying(false);
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (playing()) {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
      setPlaying(false);
    } else {
      if (selectedStation()) {
        const station = stations().find(s => s.name === selectedStation());
        if (station) {
          if (audioRef) {
            audioRef.src = station.url_resolved;
            audioRef.play();
            setPlaying(true);
          }
        }
      }
    }
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen p-4 text-gray-800" dir="rtl">
      <div class="w-full max-w-md md:max-w-lg lg:max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-purple-600">الراديو العربي</h2>
          <button
            onClick={() => navigate(-1)}
            class="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out cursor-pointer"
            aria-label="العودة"
          >
            🔙
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-lg font-semibold mb-2 text-gray-700">اختر دولة:</label>
            <Show when={loadingCountries()}>
              <p>جاري تحميل قائمة الدول...</p>
            </Show>
            <Show when={!loadingCountries()}>
              <select
                value={selectedCountry()}
                onChange={handleCountryChange}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer text-gray-800"
              >
                <option value="">-- اختر الدولة --</option>
                <For each={countries()}>
                  {(country) => (
                    <option value={country.arName}>{country.arName}</option>
                  )}
                </For>
              </select>
            </Show>
          </div>
          <Show when={selectedCountry()}>
            <div>
              <label class="block text-lg font-semibold mb-2 text-gray-700">اختر محطة:</label>
              <Show when={loadingStations()}>
                <p>جاري تحميل قائمة المحطات...</p>
              </Show>
              <Show when={!loadingStations()}>
                <select
                  value={selectedStation()}
                  onChange={handleStationChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer text-gray-800"
                >
                  <option value="">-- اختر المحطة --</option>
                  <For each={stations()}>
                    {(station) => (
                      <option value={station.name}>{station.name}</option>
                    )}
                  </For>
                </select>
              </Show>
            </div>
          </Show>
          <Show when={selectedStation()}>
            <div class="flex items-center justify-center mt-4">
              <button
                onClick={togglePlay}
                class={`px-6 py-3 ${playing() ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
              >
                {playing() ? 'إيقاف التشغيل' : 'تشغيل'}
              </button>
              <audio
                ref={(el) => (audioRef = el)}
                class="hidden"
                onEnded={() => setPlaying(false)}
              ></audio>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default ArabRadio;