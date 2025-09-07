import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { GuestCartProvider } from './context/GuestCartContext';
import { WishlistProvider } from './context/WishlistContext';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import GuestCart from './pages/GuestCart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCollections from './pages/admin/AdminCollections';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminRoute from './components/admin/AdminRoute';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import SizeGuide from './pages/SizeGuide';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import CategoryPage from './pages/CategoryPage';
import CollectionPage from './pages/CollectionPage';

// Toast configuration
const toastOptions = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#fff',
    color: '#374151',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  success: {
    iconTheme: {
      primary: '#10B981',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#EF4444',
      secondary: '#fff',
    },
  },
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <GuestCartProvider>
            <WishlistProvider>
            <div className="App">
              <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<GuestCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/collection/:slug" element={<CollectionPage />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/collections" element={<AdminRoute><AdminCollections /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
              <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
            </Routes>
            
              <Toaster
                position={toastOptions.position}
                toastOptions={toastOptions}
              />
            </div>
            </WishlistProvider>
          </GuestCartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;