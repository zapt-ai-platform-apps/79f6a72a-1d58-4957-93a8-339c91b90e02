import { useNavigate } from '@solidjs/router';
import { createSignal, Show, For, createEffect, onCleanup } from 'solid-js';

function Radio() {
  const navigate = useNavigate();
  const [countries] = createSignal([
    { arabicName: 'مصر', englishName: 'Egypt' },
    { arabicName: 'السعودية', englishName: 'Saudi Arabia' },
    { arabicName: 'الإمارات', englishName: 'United Arab Emirates' },
    { arabicName: 'الكويت', englishName: 'Kuwait' },
    { arabicName: 'قطر', englishName: 'Qatar' },
    { arabicName: 'البحرين', englishName: 'Bahrain' },
    { arabicName: 'عُمان', englishName: 'Oman' },
    { arabicName: 'اليمن', englishName: 'Yemen' },
    { arabicName: 'العراق', englishName: 'Iraq' },
    { arabicName: 'سوريا', englishName: 'Syria' },
    { arabicName: 'لبنان', englishName: 'Lebanon' },
    { arabicName: 'الأردن', englishName: 'Jordan' },
    { arabicName: 'فلسطين', englishName: 'Palestine' },
    { arabicName: 'السودان', englishName: 'Sudan' },
    { arabicName: 'ليبيا', englishName: 'Libya' },
    { arabicName: 'تونس', englishName: 'Tunisia' },
    { arabicName: 'الجزائر', englishName: 'Algeria' },
    { arabicName: 'المغرب', englishName: 'Morocco' },
    { arabicName: 'موريتانيا', englishName: 'Mauritania' },
    { arabicName: 'الصومال', englishName: 'Somalia' },
    { arabicName: 'جيبوتي', englishName: 'Djibouti' },
    { arabicName: 'جزر القمر', englishName: 'Comoros' },
  ]);

  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [stations, setStations] = createSignal([]);
  const [loadingStations, setLoadingStations] = createSignal(false);
  const [currentStationUrl, setCurrentStationUrl] = createSignal('');
  const [selectedStation, setSelectedStation] = createSignal(-1);
  const [currentStationIndex, setCurrentStationIndex] = createSignal(-1);
  const [error, setError] = createSignal('');
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [volume, setVolume] = createSignal(1);
  let audioElement;

  createEffect(async () => {
    const countryName = selectedCountry();
    if (!countryName) {
      setStations([]);
      setSelectedStation(-1);
      setCurrentStationUrl('');
      setCurrentStationIndex(-1);
      return;
    }
    const country = countries().find(
      (c) => c.arabicName === countryName
    );
    if (!country) return;
    setLoadingStations(true);
    setError('');
    try {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(
          country.englishName
        )}?hidebroken=true`
      );
      if (!response.ok) {
        throw new Error('فشل في جلب المحطات.');
      }
      const data = await response.json();
      // Filter stations with a valid URL
      const validStations = data.filter(
        (station) => station.url_resolved && station.name
      );
      setStations(validStations);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError('حدث خطأ أثناء جلب المحطات.');
    } finally {
      setLoadingStations(false);
    }
  });

  createEffect(() => {
    if (audioElement) {
      audioElement.volume = volume();
    }
  });

  const handlePlayStation = (index) => {
    if (index >= 0 && index < stations().length) {
      setCurrentStationIndex(index);
      const station = stations()[index];
      setCurrentStationUrl(station.url_resolved);
      setSelectedStation(index);
      setIsPlaying(true);
    }
  };

  const handleNextStation = () => {
    if (stations().length === 0) return;
    let newIndex = currentStationIndex() + 1;
    if (newIndex >= stations().length) {
      newIndex = 0; // Wrap around
    }
    handlePlayStation(newIndex);
  };

  const handlePreviousStation = () => {
    if (stations().length === 0) return;
    let newIndex = currentStationIndex() - 1;
    if (newIndex < 0) {
      newIndex = stations().length - 1; // Wrap around
    }
    handlePlayStation(newIndex);
  };

  const handlePlayPause = () => {
    if (audioElement) {
      if (isPlaying()) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    }
  };

  onCleanup(() => {
    if (audioElement) {
      audioElement.pause();
    }
  });

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">الراديو العربي</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-4">
        اختر الدولة ثم المحطة للاستماع إلى الراديو مباشرة.
      </p>
      <div class="w-full max-w-md">
        <label class="block mb-2 text-lg font-semibold text-gray-700">
          اختر الدولة:
        </label>
        <select
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
          value={selectedCountry()}
          onInput={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedStation(-1);
            setCurrentStationUrl('');
            setCurrentStationIndex(-1);
          }}
        >
          <option value="">-- اختر الدولة --</option>
          <For each={countries()}>
            {(country) => (
              <option value={country.arabicName}>{country.arabicName}</option>
            )}
          </For>
        </select>
        <Show when={loadingStations()}>
          <p class="text-center text-gray-600">جاري جلب المحطات...</p>
        </Show>
        <Show when={error()}>
          <p class="text-red-500 mt-4">{error()}</p>
        </Show>
        <Show when={stations().length > 0 && !loadingStations()}>
          <div class="mt-6">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">
              المحطات المتاحة:
            </h2>
            <select
              class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
              value={selectedStation()}
              onInput={(e) => {
                const index = parseInt(e.target.value);
                setSelectedStation(index);
                handlePlayStation(index);
              }}
            >
              <option value="-1">-- اختر المحطة --</option>
              <For each={stations()}>
                {(station, index) => (
                  <option value={index()}>{station.name}</option>
                )}
              </For>
            </select>
          </div>
        </Show>
        <Show when={currentStationUrl()}>
          <div class="mt-6">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">
              جاري التشغيل:
            </h2>
            <audio
              ref={(el) => (audioElement = el)}
              autoplay
              src={currentStationUrl()}
              class="w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <div class="flex justify-center mt-4 space-x-reverse space-x-4">
              <button
                onClick={handlePreviousStation}
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                المحطة السابقة
              </button>
              <button
                onClick={handlePlayPause}
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                {isPlaying() ? 'إيقاف' : 'تشغيل'}
              </button>
              <button
                onClick={handleNextStation}
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                المحطة التالية
              </button>
            </div>
            <div class="mt-6">
              <label class="block mb-2 text-lg font-semibold text-gray-700">
                مستوى الصوت:
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume()}
                onInput={(e) => setVolume(parseFloat(e.target.value))}
                class="w-full cursor-pointer"
              />
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default Radio;