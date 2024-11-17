import { useNavigate } from '@solidjs/router';
import { createSignal, onCleanup, For, Show } from 'solid-js';

function RadioPlayer() {
  const navigate = useNavigate();

  const arabCountries = [
    { name: 'Algeria', arabicName: 'الجزائر' },
    { name: 'Bahrain', arabicName: 'البحرين' },
    { name: 'Comoros', arabicName: 'جزر القمر' },
    { name: 'Djibouti', arabicName: 'جيبوتي' },
    { name: 'Egypt', arabicName: 'مصر' },
    { name: 'Iraq', arabicName: 'العراق' },
    { name: 'Jordan', arabicName: 'الأردن' },
    { name: 'Kuwait', arabicName: 'الكويت' },
    { name: 'Lebanon', arabicName: 'لبنان' },
    { name: 'Libya', arabicName: 'ليبيا' },
    { name: 'Mauritania', arabicName: 'موريتانيا' },
    { name: 'Morocco', arabicName: 'المغرب' },
    { name: 'Oman', arabicName: 'عُمان' },
    { name: 'Palestine', arabicName: 'فلسطين' },
    { name: 'Qatar', arabicName: 'قطر' },
    { name: 'Saudi Arabia', arabicName: 'السعودية' },
    { name: 'Somalia', arabicName: 'الصومال' },
    { name: 'Sudan', arabicName: 'السودان' },
    { name: 'Syria', arabicName: 'سوريا' },
    { name: 'Tunisia', arabicName: 'تونس' },
    { name: 'United Arab Emirates', arabicName: 'الإمارات العربية المتحدة' },
    { name: 'Yemen', arabicName: 'اليمن' },
  ];

  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [stations, setStations] = createSignal([]);
  const [selectedStation, setSelectedStation] = createSignal(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [audio, setAudio] = createSignal(null);
  const [loadingStations, setLoadingStations] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(null);
  const [stationSearchTerm, setStationSearchTerm] = createSignal('');
  const [filteredStations, setFilteredStations] = createSignal([]);

  const fetchStations = async (countryName) => {
    setLoadingStations(true);
    setError(null);
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(countryName)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const filteredData = data.filter((station) => station.url_resolved && station.name);
      setStations(filteredData);
      setFilteredStations(filteredData);
      setSelectedStation(null);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setError('حدث خطأ أثناء جلب المحطات. حاول مرة أخرى.');
      setStations([]);
      setFilteredStations([]);
    } finally {
      setLoadingStations(false);
    }
  };

  const handleCountryChange = async (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    stopAudio();
    await fetchStations(countryName);
  };

  const handleStationSearch = (e) => {
    const searchTerm = e.target.value;
    setStationSearchTerm(searchTerm);
    const filtered = stations().filter((station) => station.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredStations(filtered);
  };

  const handleStationSelect = (station) => {
    stopAudio();
    setSelectedStation(station);
  };

  const playAudio = () => {
    if (selectedStation()) {
      stopAudio();
      setLoading(true);
      setError(null);
      const newAudio = new Audio(selectedStation().url_resolved);

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

  onCleanup(() => {
    stopAudio();
  });

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
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
            <For each={arabCountries}>
              {(country) => (
                <option value={country.name}>{country.arabicName}</option>
              )}
            </For>
          </select>
        </div>

        <Show when={loadingStations()}>
          <div class="flex items-center justify-center mt-6">
            <svg
              class="animate-spin h-8 w-8 text-primary mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span class="ml-2 text-gray-700">جاري تحميل المحطات...</span>
          </div>
        </Show>

        <Show when={!loadingStations() && stations().length > 0}>
          <div class="mb-4">
            <label class="block mb-2 text-lg font-semibold text-gray-700">بحث عن المحطة:</label>
            <input
              type="text"
              class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              placeholder="أدخل اسم المحطة..."
              value={stationSearchTerm()}
              onInput={handleStationSearch}
            />
            <label class="block mb-2 text-lg font-semibold text-gray-700">اختر المحطة:</label>
            <div class="max-h-64 overflow-y-auto border border-gray-300 rounded-lg">
              <For each={filteredStations()}>
                {(station) => (
                  <div
                    onClick={() => handleStationSelect(station)}
                    class={`p-2 cursor-pointer hover:bg-purple-100 ${selectedStation() === station ? 'bg-purple-200' : ''}`}
                  >
                    {station.name}
                  </div>
                )}
              </For>
            </div>
          </div>

          <Show when={selectedStation()}>
            <div class="mt-6 flex items-center justify-center space-x-reverse space-x-4">
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
            </div>
          </Show>
        </Show>

        <Show when={!loadingStations() && selectedCountry() && filteredStations().length === 0}>
          <div class="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
            لا توجد محطات متاحة لهذا البلد.
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