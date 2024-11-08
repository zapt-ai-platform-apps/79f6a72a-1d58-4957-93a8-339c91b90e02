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
  const [selectedStation, setSelectedStation] = createSignal('');
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
      setSelectedStation('');
    }
  });

  const handleTogglePlay = () => {
    if (isPlaying()) {
      // Stop the audio
      if (audio()) {
        audio().pause();
        setIsPlaying(false);
      }
    } else {
      // Play the audio
      if (audio()) {
        audio().pause();
      }
      const station = stations().find(s => s.stationuuid === selectedStation());
      if (station) {
        const newAudio = new Audio(station.url_resolved);
        newAudio.play();
        setAudio(newAudio);
        setIsPlaying(true);

        newAudio.onended = () => {
          setIsPlaying(false);
        };
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

        <Show when={stations().length > 0 && !isLoading()}>
          <select
            value={selectedStation()}
            onInput={(e) => setSelectedStation(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
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
          <div class="flex flex-wrap gap-4 mt-4">
            <button
              onClick={handleTogglePlay}
              class={`flex-1 px-6 py-3 rounded-lg text-white transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
              classList={{
                'bg-green-500 hover:bg-green-600': !isPlaying(),
                'bg-red-500 hover:bg-red-600': isPlaying(),
              }}
            >
              {isPlaying() ? 'إيقاف' : 'تشغيل'}
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default ArabicRadio;