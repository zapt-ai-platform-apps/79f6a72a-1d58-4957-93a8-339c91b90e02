import { createSignal, createEffect, onMount, onCleanup, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ArabicRadio() {
  const navigate = useNavigate();

  const arabCountries = [
    'Algeria',
    'Bahrain',
    'Comoros',
    'Djibouti',
    'Egypt',
    'Iraq',
    'Jordan',
    'Kuwait',
    'Lebanon',
    'Libya',
    'Mauritania',
    'Morocco',
    'Oman',
    'Palestine',
    'Qatar',
    'Saudi Arabia',
    'Somalia',
    'Sudan',
    'Syria',
    'Tunisia',
    'United Arab Emirates',
    'Yemen'
  ];

  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [stations, setStations] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [currentStationIndex, setCurrentStationIndex] = createSignal(-1);
  const [audio, setAudio] = createSignal(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [volume, setVolume] = createSignal(1);

  const [favorites, setFavorites] = createSignal([]);

  onMount(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  });

  createEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites()));
  });

  const fetchStations = async (country) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountryexact/${encodeURIComponent(country)}`);
      if (response.ok) {
        const data = await response.json();
        setStations(data);
      } else {
        console.error('Error fetching stations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  createEffect(() => {
    if (selectedCountry()) {
      fetchStations(selectedCountry());
    } else {
      setStations([]);
      setCurrentStationIndex(-1);
    }
  });

  const selectedStation = () => {
    if (currentStationIndex() >= 0 && currentStationIndex() < stations().length) {
      return stations()[currentStationIndex()];
    }
    return null;
  };

  const handleStationSelect = (stationUuid) => {
    const index = stations().findIndex(s => s.stationuuid === stationUuid);
    if (index !== -1) {
      setCurrentStationIndex(index);
      stopAudio();
      playAudio();
    }
  };

  const handlePreviousStation = () => {
    if (currentStationIndex() > 0) {
      setCurrentStationIndex(currentStationIndex() - 1);
      stopAudio();
      playAudio();
    }
  };

  const handleNextStation = () => {
    if (currentStationIndex() < stations().length - 1) {
      setCurrentStationIndex(currentStationIndex() + 1);
      stopAudio();
      playAudio();
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying()) {
      if (audio()) {
        audio().pause();
        setIsPlaying(false);
      }
    } else {
      if (audio()) {
        audio().play();
        setIsPlaying(true);
      } else {
        playAudio();
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audio()) {
      audio().volume = newVolume;
    }
  };

  const playAudio = () => {
    const station = selectedStation();
    if (station) {
      const newAudio = new Audio(station.url_resolved);
      newAudio.volume = volume();
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);

      newAudio.onended = () => {
        setIsPlaying(false);
      };

      newAudio.onpause = () => {
        setIsPlaying(false);
      };

      newAudio.onplay = () => {
        setIsPlaying(true);
      };
    }
  };

  const stopAudio = () => {
    if (audio()) {
      audio().pause();
      setAudio(null);
      setIsPlaying(false);
    }
  };

  const toggleFavorite = () => {
    const station = selectedStation();
    if (station) {
      const currentFavorites = favorites();
      const exists = currentFavorites.find(fav => fav.stationuuid === station.stationuuid);
      if (exists) {
        setFavorites(currentFavorites.filter(fav => fav.stationuuid !== station.stationuuid));
      } else {
        setFavorites([...currentFavorites, station]);
      }
    }
  };

  const isFavorite = () => {
    const station = selectedStation();
    if (station) {
      return favorites().some(fav => fav.stationuuid === station.stationuuid);
    }
    return false;
  };

  const selectFavoriteStation = (stationUuid) => {
    const index = stations().findIndex(s => s.stationuuid === stationUuid);
    if (index !== -1) {
      setCurrentStationIndex(index);
      stopAudio();
      playAudio();
    } else {
      const favStation = favorites().find(fav => fav.stationuuid === stationUuid);
      if (favStation) {
        setStations([...stations(), favStation]);
        setCurrentStationIndex(stations().length);
        stopAudio();
        playAudio();
      }
    }
  };

  onCleanup(() => {
    if (audio()) {
      audio().pause();
    }
  });

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
        <select
          value={selectedCountry()}
          onInput={(e) => setSelectedCountry(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
        >
          <option value="">اختر دولة</option>
          <For each={arabCountries}>
            {(country) => (
              <option value={country}>{country}</option>
            )}
          </For>
        </select>

        <Show when={isLoading()}>
          <p class="text-center text-gray-700">جاري تحميل المحطات...</p>
        </Show>

        <Show when={stations().length > 0 && !isLoading()}>
          <select
            value={selectedStation() ? selectedStation().stationuuid : ''}
            onInput={(e) => handleStationSelect(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
          >
            <option value="">اختر محطة</option>
            <For each={stations()}>
              {(station) => (
                <option value={station.stationuuid}>{station.name}</option>
              )}
            </For>
          </select>
        </Show>

        <Show when={selectedStation()}>
          <div class="flex flex-col space-y-4 mt-4 w-full">
            <div class="flex flex-wrap gap-4">
              <button
                onClick={handlePreviousStation}
                class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                disabled={currentStationIndex() <= 0}
              >
                المحطة السابقة
              </button>
              <button
                onClick={handleTogglePlay}
                class={`flex-1 px-6 py-3 rounded-lg text-white transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isPlaying() ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isPlaying() ? 'إيقاف' : 'تشغيل'}
              </button>
              <button
                onClick={handleNextStation}
                class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                disabled={currentStationIndex() >= stations().length - 1}
              >
                المحطة التالية
              </button>
            </div>
            <div class="flex flex-wrap gap-4">
              <button
                onClick={toggleFavorite}
                class={`flex-1 px-6 py-3 rounded-lg text-white transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isFavorite() ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
              >
                {isFavorite() ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              </button>
            </div>
            <div class="w-full">
              <label for="volume-slider" class="block text-gray-700 mb-2">درجة الصوت</label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume()}
                onInput={handleVolumeChange}
                class="w-full cursor-pointer"
              />
            </div>
          </div>
        </Show>

        <Show when={favorites().length > 0}>
          <div class="mt-6">
            <h3 class="text-xl font-bold mb-2 text-purple-600">المفضلة</h3>
            <div class="space-y-2">
              <For each={favorites()}>
                {(favStation) => (
                  <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                    <span>{favStation.name}</span>
                    <button
                      onClick={() => selectFavoriteStation(favStation.stationuuid)}
                      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      تشغيل
                    </button>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ArabicRadio;