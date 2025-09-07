import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { categoriesNewAPI, CategoryNew } from '../../services/categoriesNewAPI';
import { collectionsAPI, Collection } from '../../services/collectionsAPI';

const CategoriesShowcase: React.FC = () => {
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Temporary: Use static data until backend is restarted
        const staticCategoryTree = [
          {
            _id: '1',
            name: 'Women',
            targetGender: 'women',
            subcategories: [
              {
                _id: '2',
                name: 'Stitched',
                stitchType: 'stitched',
                subcategories: [
                  { _id: '3', name: 'One Piece', slug: 'one-piece', pieceCount: 1, sizes: ['S', 'M', 'L'] },
                  { _id: '4', name: 'Two Piece', slug: 'two-piece', pieceCount: 2, sizes: ['S', 'M', 'L'] },
                  { _id: '5', name: 'Three Piece', slug: 'three-piece', pieceCount: 3, sizes: ['S', 'M', 'L'] }
                ]
              },
              {
                _id: '6',
                name: 'Unstitched',
                stitchType: 'unstitched',
                subcategories: [
                  { _id: '7', name: 'One Piece', slug: 'unstitched-one-piece', pieceCount: 1 },
                  { _id: '8', name: 'Two Piece', slug: 'unstitched-two-piece', pieceCount: 2 },
                  { _id: '9', name: 'Three Piece', slug: 'unstitched-three-piece', pieceCount: 3 }
                ]
              }
            ]
          },
          {
            _id: '10',
            name: 'Kids',
            targetGender: 'unisex',
            subcategories: [
              {
                _id: '11',
                name: 'Boys',
                stitchType: 'both',
                subcategories: [
                  { _id: '12', name: 'Shalwar Kameez', slug: 'boys-shalwar-kameez', sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'] },
                  { _id: '13', name: 'Shirts', slug: 'boys-shirts', sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'] },
                  { _id: '14', name: 'Pants', slug: 'boys-pants', sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'] }
                ]
              },
              {
                _id: '15',
                name: 'Girls',
                stitchType: 'both',
                subcategories: [
                  { _id: '16', name: 'Shalwar Kameez', slug: 'girls-shalwar-kameez', sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'] },
                  { _id: '17', name: 'Frock', slug: 'girls-frock', sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'] },
                  { _id: '18', name: 'Pants', slug: 'girls-pants', sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'] }
                ]
              }
            ]
          }
        ];
        
        const staticCollections = [
          { _id: '19', name: 'Winter Collection', slug: 'winter-collection', description: 'Warm and cozy winter wear', season: 'winter', isSpecial: false, isActive: true, sortOrder: 1, createdAt: '', updatedAt: '' },
          { _id: '20', name: 'Summer Collection', slug: 'summer-collection', description: 'Light and breathable summer clothing', season: 'summer', isSpecial: false, isActive: true, sortOrder: 2, createdAt: '', updatedAt: '' },
          { _id: '21', name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest fashion trends and styles', season: 'all-season', isSpecial: true, isActive: true, sortOrder: 3, createdAt: '', updatedAt: '' }
        ];
        
        setCategoryTree(staticCategoryTree);
        setCollections(staticCollections);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Discover our complete range of Pakistani fashion for the whole family
          </p>
        </motion.div>

        {/* Main Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {categoryTree.map((mainCategory, index) => (
            <motion.div
              key={mainCategory._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-elegant overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{mainCategory.name}</h3>
                    <p className="text-primary-100">
                      {mainCategory.targetGender === 'women' ? 'Elegant styles for modern women' : 
                       mainCategory.targetGender === 'unisex' ? 'Adorable outfits for little ones' : 
                       'Premium quality clothing'}
                    </p>
                  </div>
                  <div className="text-4xl opacity-20">
                    {mainCategory.targetGender === 'women' ? '👗' : '👶'}
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mainCategory.subcategories?.map((subCategory: any) => (
                    <div key={subCategory._id} className="space-y-3">
                      {/* Subcategory Title */}
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          subCategory.stitchType === 'stitched' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <h4 className="font-semibold text-secondary-800">
                          {subCategory.name}
                        </h4>
                        <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded-full">
                          {subCategory.stitchType}
                        </span>
                      </div>

                      {/* Sub-subcategories */}
                      <div className="space-y-2 ml-5">
                        {subCategory.subcategories?.map((subSubCategory: any) => (
                          <Link
                            key={subSubCategory._id}
                            to={`/category/${subSubCategory.slug}`}
                            className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium">
                                {subSubCategory.name}
                              </span>
                              {subSubCategory.pieceCount && (
                                <span className="text-xs bg-white text-secondary-600 px-2 py-1 rounded-full border">
                                  {subSubCategory.pieceCount} Piece
                                </span>
                              )}
                              {subSubCategory.sizes && subSubCategory.sizes.length > 0 && (
                                <span className="text-xs text-secondary-500">
                                  ({subSubCategory.sizes.join(', ')})
                                </span>
                              )}
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-secondary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Button */}
                <div className="mt-6 pt-4 border-t border-secondary-100">
                  <Link
                    to={`/category/${mainCategory.name.toLowerCase()}`}
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <span className="font-medium">View All {mainCategory.name}</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Collections Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-elegant p-8"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <SparklesIcon className="w-6 h-6 text-primary-600" />
              <h3 className="text-2xl font-bold text-secondary-900">Special Collections</h3>
              <SparklesIcon className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-secondary-600">Curated collections for every season and occasion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection: any, index: number) => (
              <motion.div
                key={collection._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/collection/${collection.slug}`}
                  className="block p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl hover:from-primary-100 hover:to-secondary-100 transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">
                      {collection.season === 'winter' ? '❄️' : 
                       collection.season === 'summer' ? '☀️' : '✨'}
                    </div>
                    <h4 className="font-bold text-secondary-800 mb-2 group-hover:text-primary-700 transition-colors">
                      {collection.name}
                    </h4>
                    <p className="text-sm text-secondary-600 mb-4">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-center space-x-1 text-primary-600 group-hover:text-primary-700">
                      <span className="text-sm font-medium">Explore</span>
                      <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesShowcase;