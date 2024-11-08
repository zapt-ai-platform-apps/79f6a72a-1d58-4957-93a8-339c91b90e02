import { createSignal, createEffect, Show, For, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ArabRadio() {
  const [countries, setCountries] = createSignal([]);
  const [stations, setStations] = createSignal([]);
  const [filteredStations, setFilteredStations] = createSignal([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [favorites, setFavorites] = createSignal([]);
  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [selectedStation, setSelectedStation] = createSignal(null);
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
      setFilteredStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoadingStations(false);
    }
  };

  const playStation = (station) => {
    if (audio) {
      audio.pause();
    }
    audio = new Audio(station.url_resolved);
    audio.play();
    setSelectedStation(station);
    setIsPlaying(true);
  };

  const stopStation = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleFavorite = (station) => {
    let updatedFavorites;
    if (favorites().some(fav => fav.stationuuid === station.stationuuid)) {
      updatedFavorites = favorites().filter(fav => fav.stationuuid !== station.stationuuid);
    } else {
      updatedFavorites = [...favorites(), station];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteStations', JSON.stringify(updatedFavorites));
  };

  const loadFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteStations')) || [];
    setFavorites(savedFavorites);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const term = e.target.value.toLowerCase();
    const filtered = stations().filter(station => station.name.toLowerCase().includes(term));
    setFilteredStations(filtered);
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">الراديو العربي</h2>
      <div class="w-full max-w-4xl space-y-4 mb-4">
        <div class="flex flex-col md:flex-row md:space-x-4 w-full">
          <div class="flex-1 mb-4 md:mb-0">
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
          <div class="flex-1">
            <label class="block mb-2">ابحث عن محطة:</label>
            <input
              type="text"
              value={searchTerm()}
              onInput={handleSearch}
              placeholder="اكتب اسم المحطة..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            />
          </div>
        </div>
        <Show when={loadingStations()}>
          <div class="text-center mt-4">جاري تحميل المحطات...</div>
        </Show>
        <Show when={!loadingStations() && filteredStations().length > 0}>
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <For each={filteredStations()}>
              {(station) => (
                <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                  <img src={station.favicon || 'https://via.placeholder.com/100'} alt={station.name} class="w-20 h-20 mb-2" />
                  <p class="text-center font-semibold">{station.name}</p>
                  <div class="mt-2 flex space-x-2">
                    <button
                      onClick={() => playStation(station)}
                      class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      تشغيل
                    </button>
                    <button
                      onClick={() => toggleFavorite(station)}
                      class={`px-4 py-2 ${favorites().some(fav => fav.stationuuid === station.stationuuid) ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
                      title={favorites().some(fav => fav.stationuuid === station.stationuuid) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                    >
                      {favorites().some(fav => fav.stationuuid === station.stationuuid) ? '★' : '☆'}
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
        <Show when={!loadingStations() && filteredStations().length === 0 && selectedCountry()}>
          <div class="text-center mt-4">لا توجد محطات متاحة.</div>
        </Show>
      </div>
      <Show when={isPlaying() && selectedStation()}>
        <div class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex items-center justify-between">
          <div class="flex items-center">
            <img src={selectedStation().favicon || 'https://via.placeholder.com/50'} alt={selectedStation().name} class="w-12 h-12 mr-4" />
            <p class="font-semibold">{selectedStation().name}</p>
          </div>
          <button
            onClick={stopStation}
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إيقاف التشغيل
          </button>
        </div>
      </Show>
      <div class="w-full max-w-4xl mt-8">
        <h3 class="text-2xl font-bold text-purple-600 mb-4">المحطات المفضلة</h3>
        <Show when={favorites().length > 0}>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <For each={favorites()}>
              {(station) => (
                <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                  <img src={station.favicon || 'https://via.placeholder.com/100'} alt={station.name} class="w-20 h-20 mb-2" />
                  <p class="text-center font-semibold">{station.name}</p>
                  <div class="mt-2 flex space-x-2">
                    <button
                      onClick={() => playStation(station)}
                      class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      تشغيل
                    </button>
                    <button
                      onClick={() => toggleFavorite(station)}
                      class={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
                      title="إزالة من المفضلة"
                    >
                      ★
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