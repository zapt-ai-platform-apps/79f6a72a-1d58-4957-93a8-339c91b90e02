import { createStore } from 'solid-js/store';

export const [state, setState] = createStore({
  generatedContent: '',
  assistantConversation: [],
  processedText: '',
  userPrompt: '',
  contentType: '',
  userText: '',
  selectedOption: '',
  generatedResume: '',
  name: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
  summary: '',
  skills: '',
  workExperience: '',
  education: '',
  certifications: '',
  languages: '',
  hobbies: '',
});