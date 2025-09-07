import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
// Social media icons will be replaced with simple text for now

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-primary-600">
        <div className="container-custom py-12">
          <div className="text-center">
            <h3 className="text-2xl font-display font-bold mb-4">
              Stay in Style
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals, 
              exclusive offers, and fashion tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img src="/Logo.jpeg" alt="Rawaiti Pehnawa" className="h-10 w-auto" />
              <span className="text-2xl font-display font-bold">Rawayti Pehnawa</span>
            </div>
            <p className="text-secondary-300 leading-relaxed">
              Rawayti Pehnawa brings you authentic Pakistani fashion with modern elegance. 
              Quality clothing that celebrates tradition while embracing contemporary style.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/rawayti_pehnawa?igsh=MWZncWR6ZDJxY3J6Yw==" target="_blank" rel="noopener noreferrer" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-secondary-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-secondary-300 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-secondary-300 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-secondary-300 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-secondary-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/category/women" className="text-secondary-300 hover:text-white transition-colors">
                  Women's Clothing
                </Link>
              </li>
              <li>
                <Link to="/category/kids" className="text-secondary-300 hover:text-white transition-colors">
                  Kids' Clothing
                </Link>
              </li>
              <li>
                <Link to="/category/tops" className="text-secondary-300 hover:text-white transition-colors">
                  Tops & Blouses
                </Link>
              </li>
              <li>
                <Link to="/category/dresses" className="text-secondary-300 hover:text-white transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/sale" className="text-secondary-300 hover:text-white transition-colors">
                  Sale Items
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-300 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div className="text-secondary-300">
                  <p>Bahria Town Phase 6</p>
                  <p>Empire Heights 2, Block B</p>
                  <p>Ground Floor, Shop No 8</p>
                  <p>Islamabad, Pakistan 44000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-secondary-300">rawaiti.pehnawa01@gmail.com</span>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-6">
              <h5 className="font-semibold mb-3">Business Hours</h5>
              <div className="text-secondary-300 text-sm space-y-1">
                <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                <p>Saturday: 10:00 AM - 6:00 PM</p>
                <p>Sunday: 12:00 PM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Trust Badges */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-secondary-400 text-sm">We Accept:</span>
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded px-3 py-2 flex items-center">
                  <span className="text-sm font-bold text-blue-600">VISA</span>
                </div>
                <div className="bg-white rounded px-3 py-2 flex items-center">
                  <span className="text-sm font-bold text-green-600">EasyPaisa</span>
                </div>
                <div className="bg-white rounded px-3 py-2 flex items-center">
                  <span className="text-sm font-bold text-gray-700">Card Payment</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-secondary-400 text-sm">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-400 text-sm">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-secondary-800 border-t border-secondary-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-secondary-400 text-sm">
              <span>© {currentYear} Rawayti Pehnawa. Made with</span>
              <HeartIcon className="w-4 h-4 text-red-500" />
              <span>for fashion lovers.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-secondary-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-secondary-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-secondary-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;