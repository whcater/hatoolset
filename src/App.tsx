import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { Home } from './pages/Home';
import { ToolDetail } from './pages/ToolDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/:toolId" element={<ToolDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App; 