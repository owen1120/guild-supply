import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { MainLayout } from './components/layout/MainLayout'; 

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;