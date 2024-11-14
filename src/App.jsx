import { Routes, Route } from '@solidjs/router';
import Home from './pages/Home';
import MainPage from './pages/MainPage';
import Assistant from './components/Assistant';
import AssistantConversation from './components/AssistantConversation';
import SmartTextEditor from './components/SmartTextEditor';
import ProcessedText from './components/ProcessedText';
import ArabicRadio from './components/ArabicRadio';
import AIContentCreator from './components/AIContentCreator';
import GeneratedContent from './components/GeneratedContent';
import Calculator from './components/Calculator';
import ResumeGenerator from './components/ResumeGenerator';
import GeneratedResume from './components/GeneratedResume';
import Service from './pages/Service';
import BottomNavBar from './components/BottomNavBar';

function App() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800 relative" dir="rtl">
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/home" component={MainPage} />
        <Route path="/assistant" component={Assistant} />
        <Route path="/assistant-conversation" component={AssistantConversation} />
        <Route path="/editor" component={SmartTextEditor} />
        <Route path="/processed-text" component={ProcessedText} />
        <Route path="/radio" component={ArabicRadio} />
        <Route path="/content-creator" component={AIContentCreator} />
        <Route path="/generated-content" component={GeneratedContent} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/resume-generator" component={ResumeGenerator} />
        <Route path="/generated-resume" component={GeneratedResume} />
        <Route path="/service" component={Service} />
      </Routes>
      <BottomNavBar />
    </div>
  );
}

export default App;