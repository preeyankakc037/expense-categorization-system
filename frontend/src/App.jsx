import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { AIAssistant } from './pages/AIAssistant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="assistant" element={<AIAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
