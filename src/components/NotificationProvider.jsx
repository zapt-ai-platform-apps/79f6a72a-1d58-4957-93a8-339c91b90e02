import { createSignal, Show, onCleanup, createContext, useContext } from 'solid-js';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

function NotificationProvider(props) {
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

  return (
    <NotificationContext.Provider value={showNotification}>
      {props.children}
      <Show when={notification()}>
        <div
          class={`fixed top-4 right-4 p-4 rounded shadow-lg text-white z-50 cursor-pointer ${
            notification().type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
          onClick={() => setNotification(null)}
        >
          {notification().message}
        </div>
      </Show>
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;