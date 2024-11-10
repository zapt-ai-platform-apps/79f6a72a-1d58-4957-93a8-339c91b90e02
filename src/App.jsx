import { Routes, Route } from '@solidjs/router';
import Home from './pages/Home';
import Assistant from './components/Assistant';
import SmartTextEditor from './components/SmartTextEditor';
import ArabicRadio from './components/ArabicRadio';
import CVGenerator from './components/CVGenerator';

function App() {
  return (
    <div class="h-full bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800" dir="rtl">
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/assistant" component={Assistant} />
        <Route path="/editor" component={SmartTextEditor} />
        <Route path="/radio" component={ArabicRadio} />
        <Route path="/cv-generator" component={CVGenerator} />
      </Routes>
    </div>
  );
}

export default App;