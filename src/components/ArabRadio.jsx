import { createSignal, createEffect, Show, For, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ArabRadio() {
  const [countries, setCountries] = createSignal([]);
  const [stations, setStations] = createSignal([]);
  const [favorites, setFavorites] = createSignal([]);
  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [selectedStation, setSelectedStation] = createSignal('');
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [loadingCountries, setLoadingCountries] = createSignal(false);
  const [loadingStations, setLoadingStations] = createSignal(false);
  const navigate = useNavigate();

  let audio = null;

  onMount(() => {
    fetchCountries();
    loadFavorites();
  });

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/countries');
      const data = await response.json();
      const arabCountries = data.filter(country => country.name.match(/^(Egypt|Saudi Arabia|Lebanon|Jordan|Iraq|Syria|Morocco|Algeria|Tunisia|Libya|Sudan|Yemen|Oman|Qatar|Kuwait|Bahrain|United Arab Emirates|Mauritania|Palestine)$/i));
      setCountries(arabCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchStations = async (country) => {
    setLoadingStations(true);
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(country)}?hidebroken=true`);
      const data = await response.json();
      setStations(data);
      setSelectedStation('');
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoadingStations(false);
    }
  };

  const playStation = () => {
    if (audio) {
      audio.pause();
    }
    const station = stations().find(s => s.stationuuid === selectedStation());
    if (station) {
      audio = new Audio(station.url_resolved);
      audio.play();
      setIsPlaying(true);
    }
  };

  const stopStation = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleFavorite = () => {
    const station = stations().find(s => s.stationuuid === selectedStation());
    if (station) {
      let updatedFavorites;
      if (favorites().some(fav => fav.stationuuid === station.stationuuid)) {
        updatedFavorites = favorites().filter(fav => fav.stationuuid !== station.stationuuid);
      } else {
        updatedFavorites = [...favorites(), station];
      }
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteStations', JSON.stringify(updatedFavorites));
    }
  };

  const loadFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteStations')) || [];
    setFavorites(savedFavorites);
  };

  return (
    <div class="flex flex-col items-center p-4 min-h-screen text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">الراديو العربي</h2>
      <div class="w-full max-w-2xl space-y-4 mb-4">
        <div class="flex flex-col w-full space-y-4">
          <div>
            <label class="block mb-2">اختر الدولة:</label>
            <select
              value={selectedCountry()}
              onChange={async (e) => {
                setSelectedCountry(e.target.value);
                await fetchStations(e.target.value);
              }}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
            >
              <option value="">اختر الدولة</option>
              <For each={countries()}>
                {(country) => (
                  <option value={country.name} key={country.name}>
                    {country.name}
                  </option>
                )}
              </For>
            </select>
          </div>
          <Show when={!loadingStations() && stations().length > 0}>
            <div>
              <label class="block mb-2">اختر المحطة:</label>
              <select
                value={selectedStation()}
                onChange={(e) => setSelectedStation(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
              >
                <option value="">اختر المحطة</option>
                <For each={stations()}>
                  {(station) => (
                    <option value={station.stationuuid} key={station.stationuuid}>
                      {station.name}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </Show>
          <Show when={loadingStations()}>
            <div class="text-center mt-4">جاري تحميل المحطات...</div>
          </Show>
          <Show when={!loadingStations() && selectedCountry() && stations().length === 0}>
            <div class="text-center mt-4">لا توجد محطات متاحة.</div>
          </Show>
          <div class="flex flex-wrap gap-4">
            <button
              onClick={playStation}
              class={`flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${!selectedStation() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedStation()}
            >
              تشغيل
            </button>
            <button
              onClick={toggleFavorite}
              class={`flex-1 px-6 py-3 ${favorites().some(fav => fav.stationuuid === selectedStation()) ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${!selectedStation() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedStation()}
            >
              {favorites().some(fav => fav.stationuuid === selectedStation()) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            </button>
          </div>
        </div>
      </div>
      <Show when={isPlaying()}>
        <div class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex items-center justify-between">
          <p class="font-semibold">جاري تشغيل المحطة</p>
          <button
            onClick={stopStation}
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إيقاف التشغيل
          </button>
        </div>
      </Show>
      <div class="w-full max-w-2xl mt-8">
        <h3 class="text-2xl font-bold text-purple-600 mb-4">المحطات المفضلة</h3>
        <Show when={favorites().length > 0}>
          <div class="space-y-2">
            <For each={favorites()}>
              {(station) => (
                <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                  <p class="font-semibold">{station.name}</p>
                  <div class="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedStation(station.stationuuid);
                        playStation();
                      }}
                      class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      تشغيل
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStation(station.stationuuid);
                        toggleFavorite();
                      }}
                      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      إزالة من المفضلة
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
        <Show when={favorites().length === 0}>
          <div class="text-center">لا توجد محطات مفضلة.</div>
        </Show>
      </div>
    </div>
  );
}

export default ArabRadio;