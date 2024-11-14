import { createSignal, onMount, For, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ArabicRadio() {
  const navigate = useNavigate();
  const [countries, setCountries] = createSignal([]);
  const [stations, setStations] = createSignal([]);
  const [favoriteStations, setFavoriteStations] = createSignal([]);
  const [currentStation, setCurrentStation] = createSignal(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [volume, setVolume] = createSignal(0.5);
  const [selectedCountry, setSelectedCountry] = createSignal('');
  let audioPlayer;

  onMount(() => {
    fetchCountries();
    loadFavorites();
  });

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/countries');
      const data = await response.json();
      const arabCountries = data.filter(country =>
        ['Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Morocco', 'Algeria', 'Iraq', 'Sudan', 'Yemen', 'Syria', 'Tunisia', 'Somalia', 'Libya', 'Jordan', 'Palestinian Territory', 'Lebanon', 'Oman', 'Kuwait', 'Mauritania', 'Qatar', 'Bahrain', 'Djibouti', 'Comoros'].includes(country.name)
      );
      setCountries(arabCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStations = async (country) => {
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(country)}`);
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteStations')) || [];
    setFavoriteStations(favorites);
  };

  const saveFavorites = () => {
    localStorage.setItem('favoriteStations', JSON.stringify(favoriteStations()));
  };

  const toggleFavorite = (station) => {
    const favorites = favoriteStations();
    if (favorites.some(fav => fav.stationuuid === station.stationuuid)) {
      setFavoriteStations(favorites.filter(fav => fav.stationuuid !== station.stationuuid));
    } else {
      setFavoriteStations([...favorites, station]);
    }
    saveFavorites();
  };

  const playStation = (station) => {
    setCurrentStation(station);
    audioPlayer.src = station.url_resolved;
    audioPlayer.play();
    setIsPlaying(true);
  };

  const stopStation = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  const isFavorite = (station) => {
    return favoriteStations().some(fav => fav.stationuuid === station.stationuuid);
  };

  const handleVolumeChange = (e) => {
    const vol = e.target.value;
    setVolume(vol);
    if (audioPlayer) {
      audioPlayer.volume = vol;
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">الراديو العربي مع المفضلة</h2>

      <div class="w-full max-w-4xl space-y-6">
        <div>
          <label for="country-select" class="block text-gray-700 mb-2">اختر الدولة:</label>
          <select
            id="country-select"
            value={selectedCountry()}
            onInput={(e) => {
              setSelectedCountry(e.target.value);
              fetchStations(e.target.value);
            }}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
          >
            <option value="">اختر دولة</option>
            <For each={countries()}>
              {(country) => (
                <option value={country.name}>{country.name}</option>
              )}
            </For>
          </select>
        </div>

        <Show when={stations().length > 0}>
          <div>
            <h3 class="text-2xl font-bold text-purple-600 mb-4">المحطات:</h3>
            <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <For each={stations()}>
                {(station) => (
                  <div class="flex justify-between items-center mb-2">
                    <span>{station.name}</span>
                    <div class="flex space-x-2">
                      <button
                        onClick={() => playStation(station)}
                        class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        تشغيل
                      </button>
                      <button
                        onClick={() => toggleFavorite(station)}
                        class={`px-3 py-1 ${isFavorite(station) ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
                      >
                        {isFavorite(station) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>

        <Show when={favoriteStations().length > 0}>
          <div>
            <h3 class="text-2xl font-bold text-purple-600 mb-4">المفضلة:</h3>
            <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <For each={favoriteStations()}>
                {(station) => (
                  <div class="flex justify-between items-center mb-2">
                    <span>{station.name}</span>
                    <div class="flex space-x-2">
                      <button
                        onClick={() => playStation(station)}
                        class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        تشغيل
                      </button>
                      <button
                        onClick={() => toggleFavorite(station)}
                        class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      >
                        إزالة من المفضلة
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>

        <Show when={currentStation()}>
          <div class="w-full p-4 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-2 text-purple-600">يتم الآن تشغيل: {currentStation().name}</h3>
            <div class="flex items-center space-x-4">
              <button
                onClick={isPlaying() ? stopStation : () => audioPlayer.play()}
                class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                {isPlaying() ? 'إيقاف' : 'تشغيل'}
              </button>
              <label class="flex items-center space-x-2">
                <span>درجة الصوت:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume()}
                  onInput={handleVolumeChange}
                  class="cursor-pointer"
                />
              </label>
            </div>
          </div>
        </Show>
      </div>

      <audio ref={audioPlayer} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)}></audio>
    </div>
  );
}

export default ArabicRadio;