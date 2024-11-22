import { createSignal, createContext, useContext } from 'solid-js';

const SettingsContext = createContext();

export function SettingsProvider(props) {
  const [theme, setTheme] = createSignal('light');
  const [fontSize, setFontSize] = createSignal('medium');

  const value = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
  };

  return (
    <SettingsContext.Provider value={value}>
      {props.children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}