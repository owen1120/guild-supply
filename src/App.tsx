import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout'; 
import Home from './pages/Home'; 
import Auth from './pages/Auth';
import Inventory from './pages/Inventory'; 
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import Quest from './pages/Quest';
import Notices from './pages/Notices';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/quests" 
            element={
              <ProtectedRoute>
                <Quest />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/notices" 
            element={
              <ProtectedRoute>
                <Notices />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;