import { createSignal, Show, onCleanup } from 'solid-js';

export function createNotification() {
  const [notification, setNotification] = createSignal(null);

  let timeoutId;

  const showNotification = (message, type = 'success', duration = 3000) => {
    clearTimeout(timeoutId);
    setNotification({ message, type });
    timeoutId = setTimeout(() => setNotification(null), duration);
  };

  onCleanup(() => {
    clearTimeout(timeoutId);
  });

  const NotificationComponent = () => (
    <Show when={notification()}>
      <div
        class={`fixed top-4 right-4 p-4 rounded shadow-lg text-white z-50 ${
          notification().type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {notification().message}
      </div>
    </Show>
  );

  return { NotificationComponent, showNotification };
}