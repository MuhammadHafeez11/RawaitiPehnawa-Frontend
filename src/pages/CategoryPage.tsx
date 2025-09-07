import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHelmet from '../components/common/SEOHelmet';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import { motion } from 'framer-motion';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    stitchType: '',
    pieceCount: '',
    targetGender: '',
    season: ''
  });

  // Category mapping for filtering
  const categoryMapping: Record<string, {
    targetGender: string | string[];
    name: string;
    description: string;
    stitchType?: string;
    pieceCount?: number;
  }> = {
    // Main categories
    'women': { targetGender: 'women', name: 'Women\'s Collection', description: 'Elegant styles for modern women' },
    'kids': { targetGender: ['boys', 'girls'], name: 'Kids Collection', description: 'Adorable outfits for little ones' },
    
    // Women subcategories
    'one-piece': { targetGender: 'women', stitchType: 'stitched', pieceCount: 1, name: 'Women One Piece', description: 'Elegant one piece outfits' },
    'two-piece': { targetGender: 'women', stitchType: 'stitched', pieceCount: 2, name: 'Women Two Piece', description: 'Stylish two piece sets' },
    'three-piece': { targetGender: 'women', stitchType: 'stitched', pieceCount: 3, name: 'Women Three Piece', description: 'Complete three piece suits' },
    'unstitched-one-piece': { targetGender: 'women', stitchType: 'unstitched', pieceCount: 1, name: 'Unstitched Fabric', description: 'Premium unstitched fabrics' },
    'unstitched-two-piece': { targetGender: 'women', stitchType: 'unstitched', pieceCount: 2, name: 'Two Piece Fabric', description: 'Two piece fabric sets' },
    'unstitched-three-piece': { targetGender: 'women', stitchType: 'unstitched', pieceCount: 3, name: 'Three Piece Fabric', description: 'Complete fabric sets' },
    
    // Kids subcategories
    'boys-shalwar-kameez': { targetGender: 'boys', name: 'Boys Shalwar Kameez', description: 'Traditional wear for boys' },
    'boys-shirts': { targetGender: 'boys', name: 'Boys Shirts', description: 'Comfortable shirts for boys' },
    'boys-pants': { targetGender: 'boys', name: 'Boys Pants', description: 'Stylish pants for boys' },
    'girls-shalwar-kameez': { targetGender: 'girls', name: 'Girls Shalwar Kameez', description: 'Traditional wear for girls' },
    'girls-frock': { targetGender: 'girls', name: 'Girls Frocks', description: 'Beautiful frocks for girls' },
    'girls-pants': { targetGender: 'girls', name: 'Girls Pants', description: 'Comfortable pants for girls' }
  };

  const currentCategory = slug ? categoryMapping[slug as keyof typeof categoryMapping] : null;

  useEffect(() => {
    const loadProducts = async () => {
      if (!slug || !currentCategory) {
        setError('Category not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get all products
        const response = await productsAPI.getProducts({});
        
        if (response.success && response.data) {
          let filteredProducts = response.data.products;

          // Apply category filters
          if (currentCategory.targetGender) {
            if (Array.isArray(currentCategory.targetGender)) {
              filteredProducts = filteredProducts.filter(product => 
                product.targetGender && currentCategory.targetGender.includes(product.targetGender)
              );
            } else {
              filteredProducts = filteredProducts.filter(product => 
                product.targetGender === currentCategory.targetGender
              );
            }
          }

          if (currentCategory.stitchType) {
            filteredProducts = filteredProducts.filter(product => 
              product.stitchType === currentCategory.stitchType
            );
          }

          if (currentCategory.pieceCount) {
            filteredProducts = filteredProducts.filter(product => 
              product.pieceCount === currentCategory.pieceCount
            );
          }

          // Apply additional filters
          if (filters.stitchType) {
            filteredProducts = filteredProducts.filter(product => 
              product.stitchType === filters.stitchType
            );
          }

          if (filters.pieceCount) {
            filteredProducts = filteredProducts.filter(product => 
              product.pieceCount === parseInt(filters.pieceCount)
            );
          }

          if (filters.season) {
            filteredProducts = filteredProducts.filter(product => 
              product.season === filters.season || product.season === 'all-season'
            );
          }

          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Failed to load category products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [slug, filters]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev] === value ? '' : value
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !currentCategory) {
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-bold text-secondary-800 mb-4">Category Not Found</h1>
          <p className="text-secondary-600">The category you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHelmet 
        title={`${currentCategory.name} - Rawayti Pehnawa`}
        description={currentCategory.description}
      />
      
      {/* Category Header */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
              {currentCategory.name}
            </h1>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto mb-8">
              {currentCategory.description}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-secondary-500">
              <span>{products.length} Products</span>
              {currentCategory.stitchType && !slug?.includes('boys') && !slug?.includes('girls') && (
                <>
                  <span>•</span>
                  <span className="capitalize">{currentCategory.stitchType}</span>
                </>
              )}
              {currentCategory.pieceCount && !slug?.includes('boys') && !slug?.includes('girls') && (
                <>
                  <span>•</span>
                  <span>{currentCategory.pieceCount} Piece</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4">
            {/* Stitch Type Filter - Only for women categories */}
            {!currentCategory.stitchType && !slug?.includes('boys') && !slug?.includes('girls') && !slug?.includes('kids') && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-secondary-700">Stitch Type:</span>
                <button
                  onClick={() => handleFilterChange('stitchType', 'stitched')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.stitchType === 'stitched'
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  Stitched
                </button>
                <button
                  onClick={() => handleFilterChange('stitchType', 'unstitched')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.stitchType === 'unstitched'
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  Unstitched
                </button>
              </div>
            )}

            {/* Piece Count Filter - Only for women categories */}
            {!currentCategory.pieceCount && !slug?.includes('boys') && !slug?.includes('girls') && !slug?.includes('kids') && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-secondary-700">Pieces:</span>
                {[1, 2, 3].map(count => (
                  <button
                    key={count}
                    onClick={() => handleFilterChange('pieceCount', count.toString())}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.pieceCount === count.toString()
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {count} Piece
                  </button>
                ))}
              </div>
            )}

            {/* Season Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-secondary-700">Season:</span>
              {['summer', 'winter'].map(season => (
                <button
                  key={season}
                  onClick={() => handleFilterChange('season', season)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                    filters.season === season
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
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
                Try adjusting your filters or check back later for new products.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;