import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHelmet from '../components/common/SEOHelmet';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import { motion } from 'framer-motion';

const CollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const collectionInfo = {
    'winter-collection': {
      name: 'Winter Collection',
      description: 'Warm and cozy winter wear for the whole family',
      season: 'winter',
      emoji: '❄️'
    },
    'summer-collection': {
      name: 'Summer Collection', 
      description: 'Light and breathable summer clothing',
      season: 'summer',
      emoji: '☀️'
    },
    'new-arrivals': {
      name: 'New Arrivals',
      description: 'Latest fashion trends and styles',
      season: 'all-season',
      emoji: '✨'
    }
  };

  const currentCollection = slug ? collectionInfo[slug as keyof typeof collectionInfo] : null;

  useEffect(() => {
    const loadProducts = async () => {
      if (!slug || !currentCollection) {
        setError('Collection not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get all products and filter by collection criteria
        const response = await productsAPI.getProducts({});
        
        if (response.success && response.data) {
          let filteredProducts = response.data.products;

          // Filter based on collection type
          if (slug === 'winter-collection') {
            filteredProducts = filteredProducts.filter(product => 
              product.season === 'winter' || product.season === 'all-season'
            );
          } else if (slug === 'summer-collection') {
            filteredProducts = filteredProducts.filter(product => 
              product.season === 'summer' || product.season === 'all-season'
            );
          } else if (slug === 'new-arrivals') {
            // Get newest products (featured products for now)
            filteredProducts = filteredProducts.filter(product => product.isFeatured);
          }

          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Failed to load collection products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !currentCollection) {
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-bold text-secondary-800 mb-4">Collection Not Found</h1>
          <p className="text-secondary-600">The collection you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHelmet 
        title={`${currentCollection.name} - Rawayti Pehnawa`}
        description={currentCollection.description}
      />
      
      {/* Collection Header */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">{currentCollection.emoji}</div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
              {currentCollection.name}
            </h1>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto mb-8">
              {currentCollection.description}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-secondary-500">
              <span>{products.length} Products</span>
              <span>•</span>
              <span className="capitalize">{currentCollection.season} Collection</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container-custom">
          {products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold text-secondary-800 mb-4">No Products Found</h3>
              <p className="text-secondary-600">
                We're working on adding products to this collection. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CollectionPage;