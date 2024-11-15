import { createStore } from 'solid-js/store';

export const [state, setState] = createStore({
  assistantConversation: [],
  processedText: '',
  userText: '',
  selectedOption: '',
});