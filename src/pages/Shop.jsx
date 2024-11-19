import { createSignal, onMount, For, Show } from 'solid-js';
import { createNotification } from '../components/Notification';
import Loader from '../components/Loader';

function Shop() {
  const { NotificationComponent, showNotification } = createNotification();
  const [shopItems, setShopItems] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  const fetchShopItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getShopItems');
      if (response.ok) {
        const data = await response.json();
        setShopItems(data);
      } else {
        showNotification('حدث خطأ أثناء جلب المنتجات.', 'error');
      }
    } catch (error) {
      console.error('Error fetching shop items:', error);
      showNotification('حدث خطأ أثناء جلب المنتجات.', 'error');
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchShopItems();
  });

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <NotificationComponent />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">المتجر</h1>
      <Show when={!loading()} fallback={<Loader />}>
        <Show when={shopItems().length > 0} fallback={<p class="text-center">لا توجد منتجات.</p>}>
          <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <For each={shopItems()}>
              {(item) => (
                <div class="p-6 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  <h2 class="text-2xl font-bold mb-2">{item.name}</h2>
                  <Show when={item.image_url}>
                    <img src={item.image_url} alt={item.name} class="w-full h-auto mb-4 rounded-lg" />
                  </Show>
                  <p class="text-gray-700 mb-2">{item.description}</p>
                  <p class="text-gray-700 font-semibold">السعر: {item.price} دولار</p>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default Shop;