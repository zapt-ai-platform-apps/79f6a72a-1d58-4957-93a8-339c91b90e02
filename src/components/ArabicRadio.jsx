import { createSignal, createEffect, onCleanup, Show, For } from 'solid-js';
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
  const [selectedStation, setSelectedStation] = createSignal(null);
  const [audio, setAudio] = createSignal(null);
  const [isPlaying, setIsPlaying] = createSignal(false);

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
    }
  });

  const handlePlay = (station) => {
    if (audio()) {
      audio().pause();
    }
    const newAudio = new Audio(station.url_resolved);
    newAudio.play();
    setAudio(newAudio);
    setSelectedStation(station);
    setIsPlaying(true);

    newAudio.onended = () => {
      setIsPlaying(false);
    };
  };

  const handleStop = () => {
    if (audio()) {
      audio().pause();
      setIsPlaying(false);
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
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
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

        <Show when={stations().length > 0}>
          <h3 class="text-xl font-bold text-purple-600">محطات {selectedCountry()}</h3>
          <div class="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            <For each={stations()}>
              {(station) => (
                <div
                  class="p-3 bg-white rounded-lg shadow-md flex justify-between items-center"
                >
                  <p class="text-gray-700">{station.name}</p>
                  <button
                    onClick={() => handlePlay(station)}
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  >
                    تشغيل
                  </button>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={isPlaying()}>
          <div class="mt-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
            <p class="text-gray-700">تشغيل الآن: {selectedStation().name}</p>
            <button
              onClick={handleStop}
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              إيقاف
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ArabicRadio;