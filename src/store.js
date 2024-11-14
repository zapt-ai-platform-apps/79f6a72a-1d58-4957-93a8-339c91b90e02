import { createStore } from 'solid-js/store';

export const [state, setState] = createStore({
  generatedContent: '',
  assistantConversation: [],
  processedText: '',
  userPrompt: '',
  contentType: '',
  userText: '',
  selectedOption: '',
});