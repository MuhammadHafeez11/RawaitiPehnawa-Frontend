import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HeroSlider from '../components/home/HeroSlider';
import CategoriesShowcase from '../components/home/CategoriesShowcase';
import SEOHelmet from '../components/common/SEOHelmet';
import { Product, Category } from '../types';
import { productsAPI, categoriesAPI } from '../services/api';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsAPI.getFeaturedProducts(),
          categoriesAPI.getCategories()
        ]);

        if (productsResponse.success && productsResponse.data) {
          setFeaturedProducts(productsResponse.data.products);
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data.categories.filter(cat => !cat.parentCategory));
        }
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHelmet 
        title="Rawaiti Pehnawa - Premium Pakistani Fashion by Nadia"
        description="Discover elegant Pakistani fashion for women and kids. Premium quality traditional wear with modern designs and authentic craftsmanship."
      />
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-secondary-800 leading-tight">
                  Fashion
                  <span className="block text-gradient">Redefined</span>
                </h1>
                <p className="text-xl text-secondary-600 leading-relaxed max-w-lg">
                  Discover the latest trends in women's and kids' fashion. 
                  Quality meets style in every piece we curate.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn-primary inline-flex items-center justify-center">
                  Shop Now
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/products" className="btn-outline inline-flex items-center justify-center">
                  View Sale
                  <SparklesIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-800">10K+</div>
                  <div className="text-sm text-secondary-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-800">500+</div>
                  <div className="text-sm text-secondary-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-800">50+</div>
                  <div className="text-sm text-secondary-600">Brands</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <HeroSlider />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <TruckIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800">Free Shipping</h3>
              <p className="text-secondary-600">Free shipping on all orders over PKR 15,000. Fast and reliable delivery.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800">Secure Payment</h3>
              <p className="text-secondary-600">Your payment information is processed securely with SSL encryption.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <HeartIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800">Easy Returns</h3>
              <p className="text-secondary-600">30-day return policy. Not satisfied? Return it hassle-free.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Showcase - New Hierarchical Design */}
      <CategoriesShowcase />

      {/* Featured Products Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-secondary-800 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Handpicked favorites that our customers love most
            </p>
          </motion.div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">No featured products available at the moment.</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link to="/products" className="btn-primary inline-flex items-center">
              View All Products
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-bold text-white">
                Stay in the Loop
              </h2>
              <p className="text-xl text-primary-100">
                Subscribe to our newsletter for exclusive offers, new arrivals, and fashion tips
              </p>
            </div>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Subscribe
              </button>
            </form>

            <p className="text-sm text-primary-200">
              By subscribing, you agree to our Privacy Policy and Terms of Service
            </p>
          </motion.div>
        </div>
      </section> */}
    </Layout>
  );
};

export default Home;