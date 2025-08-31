import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  HeartIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useGuestCart } from '../../context/GuestCartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Category } from '../../types';
import { categoriesAPI } from '../../services/api';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useGuestCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories();
        if (response.success && response.data) {
          setCategories(response.data.categories.filter(cat => !cat.parentCategory));
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const cartItemCount = getCartItemCount();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
    }`}>
      {/* Top Bar */}
      <div className="bg-primary-600 text-white text-sm py-2">
        <div className="container-custom flex justify-between items-center">
          <p>Free shipping on orders over PKR 5,000!</p>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/track-order" className="hover:text-primary-200 transition-colors">
              Track Order
            </Link>
            <Link to="/help" className="hover:text-primary-200 transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-secondary-100">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/Logo.jpeg" 
                  alt="Rawaiti Pehnawa" 
                  className="h-16 w-16 object-contain rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden md:block">
                <div className="text-2xl font-bold text-primary-600 leading-tight group-hover:text-primary-700 transition-colors">
                  Rawaiti Pehnawa
                </div>
                <div className="text-sm text-secondary-600 font-medium tracking-wide">
                  راویتی پہناوا • by Nadia
                </div>
              </div>
              {/* Mobile brand text */}
              <div className="block md:hidden">
                <div className="text-lg font-bold text-primary-600 leading-tight">
                  Rawaiti
                </div>
                <div className="text-xs text-secondary-600">
                  راویتی
                </div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-secondary-400 hover:text-primary-600 transition-colors"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Icon - Mobile */}
              <button className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>

              {/* Wishlist */}
              <button 
                onClick={() => alert('Wishlist feature coming soon! 💝')}
                className="p-2 text-secondary-600 hover:text-primary-600 transition-colors relative"
              >
                <HeartIcon className="w-6 h-6" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </button>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="p-2 text-secondary-600 hover:text-primary-600 transition-colors relative"
              >
                <ShoppingBagIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-subtle">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Admin Login */}
              {isAuthenticated && user?.role === 'admin' ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    <UserIcon className="w-6 h-6" />
                    <span className="hidden md:block text-sm font-medium">
                      Admin
                    </span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elegant border border-secondary-100 py-2 z-50">
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  <UserIcon className="w-6 h-6" />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-secondary-100">
        <div className="container-custom">
          <div className="hidden md:flex items-center justify-center space-x-8 py-4">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-primary-600' 
                  : 'text-secondary-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className={`font-medium transition-colors ${
                  location.pathname === `/category/${category.slug}` 
                    ? 'text-primary-600' 
                    : 'text-secondary-700 hover:text-primary-600'
                }`}
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/products"
              className="font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Sale
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-secondary-100">
          <div className="container-custom py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-secondary-400"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/"
                className="block py-2 text-secondary-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="block py-2 text-secondary-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                to="/products"
                className="block py-2 text-red-600 hover:text-red-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sale
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;