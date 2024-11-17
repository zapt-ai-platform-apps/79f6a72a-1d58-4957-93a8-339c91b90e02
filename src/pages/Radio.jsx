import { useNavigate } from '@solidjs/router';
import { createSignal, Show, For } from 'solid-js';

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
  const [error, setError] = createSignal('');

  const fetchStations = async () => {
    const country = countries().find(
      (c) => c.arabicName === selectedCountry()
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
  };

  const handlePlayStation = (url) => {
    setCurrentStationUrl(url);
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
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
            setStations([]);
            setCurrentStationUrl('');
          }}
        >
          <option value="">-- اختر الدولة --</option>
          <For each={countries()}>
            {(country) => (
              <option value={country.arabicName}>{country.arabicName}</option>
            )}
          </For>
        </select>
        <Show
          when={selectedCountry()}
          fallback={<p class="text-center text-gray-600">يرجى اختيار دولة لعرض المحطات.</p>}
        >
          <button
            onClick={fetchStations}
            class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loadingStations() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loadingStations()}
          >
            <Show when={!loadingStations()} fallback="جاري جلب المحطات...">
              جلب المحطات
            </Show>
          </button>
        </Show>
        <Show when={error()}>
          <p class="text-red-500 mt-4">{error()}</p>
        </Show>
        <Show when={stations().length > 0}>
          <div class="mt-6">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">
              المحطات المتاحة:
            </h2>
            <div class="max-h-64 overflow-y-auto border border-gray-300 rounded-lg">
              <For each={stations()}>
                {(station) => (
                  <div
                    class="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePlayStation(station.url_resolved)}
                  >
                    {station.name}
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
        <Show when={currentStationUrl()}>
          <div class="mt-6">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">
              جاري التشغيل:
            </h2>
            <audio
              controls
              autoplay
              src={currentStationUrl()}
              class="w-full"
            />
          </div>
        </Show>
      </div>
    </div>
  );
}

export default Radio;