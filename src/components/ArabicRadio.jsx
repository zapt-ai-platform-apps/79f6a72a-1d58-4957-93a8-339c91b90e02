```jsx
import { createSignal, onMount, For, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ArabicRadio() {
  const navigate = useNavigate();
  const [stations, setStations] = createSignal([]);
  const [countries, setCountries] = createSignal([]);
  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [selectedStation, setSelectedStation] = createSignal(null);
  const [audio, setAudio] = createSignal(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [volume, setVolume] = createSignal(0.5);
  const [favorites, setFavorites] = createSignal(JSON.parse(localStorage.getItem('favorites')) || []);

  onMount(async () => {
    await fetchCountries();
    loadFavorites();
  });

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/countries');
      const data = await response.json();
      const arabCountries = data.filter(country => arabCountryList.includes(country.name));
      setCountries(arabCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStations = async () => {
    if (!selectedCountry()) return;
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(selectedCountry())}`);
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const playStation = (station) => {
    if (audio()) {
      audio().pause();
    }
    const newAudio = new Audio(station.url_resolved);
    newAudio.volume = volume();
    newAudio.play();
    setAudio(newAudio);
    setSelectedStation(station);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (isPlaying()) {
      audio().pause();
      setIsPlaying(false);
    } else {
      audio().play();
      setIsPlaying(true);
    }
  };

  const changeVolume = (e) => {
    const newVolume = e.target.value;
    if (audio()) {
      audio().volume = newVolume;
    }
    setVolume(newVolume);
  };

  const addToFavorites = (station) => {
    const updatedFavorites = [...favorites(), station];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (station) => {
    const updatedFavorites = favorites().filter(fav => fav.stationuuid !== station.stationuuid);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (station) => {
    return favorites().some(fav => fav.stationuuid === station.stationuuid);
  };

  const loadFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  };

  const handlePreviousStation = () => {
    const currentIndex = stations().findIndex(s => s.stationuuid === selectedStation()?.stationuuid);
    if (currentIndex > 0) {
      const previousStation = stations()[currentIndex - 1];
      playStation(previousStation);
    }
  };

  const handleNextStation = () => {
    const currentIndex = stations().findIndex(s => s.stationuuid === selectedStation()?.stationuuid);
    if (currentIndex >= 0 && currentIndex < stations().length - 1) {
      const nextStation = stations()[currentIndex + 1];
      playStation(nextStation);
    }
  };

  const hasPreviousStation = () => {
    const currentIndex = stations().findIndex(s => s.stationuuid === selectedStation()?.stationuuid);
    return currentIndex > 0;
  };

  const hasNextStation = () => {
    const currentIndex = stations().findIndex(s => s.stationuuid === selectedStation()?.stationuuid);
    return currentIndex >= 0 && currentIndex < stations().length -1;
  };

  const arabCountryList = [
    'Algeria', 'Bahrain', 'Comoros', 'Djibouti', 'Egypt', 'Iraq', 'Jordan',
    'Kuwait', 'Lebanon', 'Libya', 'Mauritania', 'Morocco', 'Oman', 'Palestine',
    'Qatar', 'Saudi Arabia', 'Somalia', 'Sudan', 'Syria', 'Tunisia',
    'United Arab Emirates', 'Yemen'
  ];

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">الراديو العربي</h2>

      <div class="w-full max-w-2xl space-y-4">
        <label for="country-select" class="block text-gray-700">
          اختر الدولة:
        </label>
        <select
          id="country-select"
          value={selectedCountry()}
          onInput={(e) => { setSelectedCountry(e.target.value); fetchStations(); }}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
        >
          <option value="">اختر الدولة</option>
          <For each={countries()}>
            {(country) => (
              <option value={country.name}>{country.name}</option>
            )}
          </For>
        </select>

        <Show when={stations().length > 0}>
          <label for="station-select" class="block text-gray-700">
            اختر المحطة:
          </label>
          <select
            id="station-select"
            value={selectedStation()?.stationuuid || ''}
            onInput={(e) => {
              const station = stations().find(s => s.stationuuid === e.target.value);
              playStation(station);
            }}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
          >
            <option value="">اختر المحطة</option>
            <For each={stations()}>
              {(station) => (
                <option value={station.stationuuid}>{station.name}</option>
              )}
            </For>
          </select>
        </Show>

        <Show when={selectedStation()}>
          <div class="mt-4 flex flex-col items-center">
            <h3 class="text-xl text-gray-700 mb-2">{selectedStation().name}</h3>
            <div class="flex flex-row items-center mb-2 space-x-4 space-x-reverse">
              <button
                onClick={handlePreviousStation}
                class={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${!hasPreviousStation() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!hasPreviousStation()}
              >
                المحطة السابقة
              </button>

              <button
                onClick={togglePlayPause}
                class={`px-6 py-3 ${isPlaying() ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg hover:${isPlaying() ? 'bg-red-600' : 'bg-green-600'} transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
              >
                {isPlaying() ? 'إيقاف' : 'تشغيل'}
              </button>

              <button
                onClick={handleNextStation}
                class={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${!hasNextStation() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!hasNextStation()}
              >
                المحطة التالية
              </button>
            </div>
            <div class="flex items-center mb-2">
              <label for="volume" class="mr-2 text-gray-700">درجة الصوت:</label>
              <input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume()}
                onInput={changeVolume}
                class="cursor-pointer"
              />
            </div>
            <button
              onClick={() => isFavorite(selectedStation()) ? removeFromFavorites(selectedStation()) : addToFavorites(selectedStation())}
              class="mt-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              {isFavorite(selectedStation()) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            </button>
          </div>
        </Show>

        <Show when={favorites().length > 0}>
          <div class="mt-6">
            <h3 class="text-2xl font-bold text-purple-600 mb-4">المفضلة</h3>
            <ul class="space-y-2">
              <For each={favorites()}>
                {(station) => (
                  <li class="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                    <span>{station.name}</span>
                    <button
                      onClick={() => playStation(station)}
                      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      تشغيل
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ArabicRadio;
```