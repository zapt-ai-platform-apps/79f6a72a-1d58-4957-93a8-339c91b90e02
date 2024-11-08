import { createSignal, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function ArabRadio() {
  const [countries, setCountries] = createSignal([]);
  const [stations, setStations] = createSignal([]);
  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [selectedStation, setSelectedStation] = createSignal('');
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  let audio = new Audio();

  createEffect(() => {
    fetchCountries();
  });

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/countries');
      const data = await response.json();
      const arabCountries = data.filter(country => country.name.match(/^(Egypt|Saudi Arabia|Lebanon|Jordan|Iraq|Syria|Morocco|Algeria|Tunisia|Libya|Sudan|Yemen|Oman|Qatar|Kuwait|Bahrain|United Arab Emirates|Mauritania|Palestine)$/i));
      setCountries(arabCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStations = async (country) => {
    setLoading(true);
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(country)}`);
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const playStation = () => {
    if (selectedStation()) {
      audio.src = selectedStation().url_resolved;
      audio.play();
      setIsPlaying(true);
    }
  };

  const stopStation = () => {
    audio.pause();
    setIsPlaying(false);
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
      <div class="w-full max-w-2xl space-y-4 mb-4">
        <div>
          <label class="block mb-2">اختر الدولة:</label>
          <select
            value={selectedCountry()}
            onChange={async (e) => {
              setSelectedCountry(e.target.value);
              await fetchStations(e.target.value);
            }}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          >
            <option value="">اختر الدولة</option>
            {countries().map((country) => (
              <option value={country.name} key={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label class="block mb-2">اختر المحطة:</label>
          <select
            value={selectedStation()}
            onChange={(e) => setSelectedStation(stations().find(station => station.stationuuid === e.target.value))}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            disabled={loading() || stations().length === 0}
          >
            <option value="">اختر المحطة</option>
            {stations().map((station) => (
              <option value={station.stationuuid} key={station.stationuuid}>
                {station.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div class="flex items-center space-x-4 justify-center">
        {!isPlaying() ? (
          <button
            onClick={playStation}
            class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            disabled={!selectedStation()}
          >
            تشغيل
          </button>
        ) : (
          <button
            onClick={stopStation}
            class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            إيقاف التشغيل
          </button>
        )}
      </div>
    </div>
  );
}

export default ArabRadio;