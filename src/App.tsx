import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout'; 
import Home from './pages/Home'; 
import Auth from './pages/Auth';
import Inventory from './pages/Inventory'; 
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;