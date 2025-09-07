import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingBagIcon, 
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Product, ProductVariant } from '../types';
import { productsAPI } from '../services/api';
import { useGuestCart } from '../context/GuestCartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useGuestCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const formatDescription = (text: string) => {
    if (!text) return '';
    
    // Split into lines and process each line
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
      line = line.trim();
      if (!line) return '<br>';
      
      // Headers
      if (line.startsWith('### ')) {
        return `<h3 class="text-lg font-semibold text-secondary-800 mt-4 mb-2">${line.substring(4)}</h3>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 class="text-xl font-semibold text-secondary-800 mt-6 mb-3">${line.substring(3)}</h2>`;
      }
      if (line.startsWith('# ')) {
        return `<h1 class="text-2xl font-bold text-secondary-800 mt-8 mb-4">${line.substring(2)}</h1>`;
      }
      
      // Bullet points
      if (line.startsWith('- ')) {
        const content = line.substring(2);
        return `<div class="flex items-start mb-2 ml-4"><span class="mr-2 mt-1">•</span><span>${content}</span></div>`;
      }
      
      // Regular text
      return `<div class="mb-2">${line}</div>`;
    });
    
    let html = processedLines.join('');
    
    // Apply bold and italic formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-secondary-800">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    return html;
  };

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (slug) {
      loadProduct(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      setSelectedSize(firstVariant.size);
      setSelectedColor('Default');
    }
  }, [product]);

  const loadProduct = async (productSlug: string) => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getProduct(productSlug);
      if (response.success && response.data) {
        setProduct(response.data.product);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setIsLoading(false);
    }
  };



  const handleAddToCart = () => {
    if (!product) return;

    if (selectedVariant) {
      if (selectedVariant.stock < quantity) {
        toast.error('Not enough stock available');
        return;
      }
      addToCart(product, selectedVariant, quantity);
    } else {
      // For products without variants
      if ((product.stock || 0) < quantity) {
        toast.error('Not enough stock available');
        return;
      }
      const defaultVariant: ProductVariant = {
        size: 'One Size',
        stock: product.stock || 0,
        price: product.price,
        sku: `${product._id}-default`
      };
      addToCart(product, defaultVariant, quantity);
    }
    toast.success('Added to cart successfully!');
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const availableSizes = product?.variants ? [...new Set(product.variants.map(v => v.size))] : [];
  const availableColors = product?.colors || [];
  const currentStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
  const currentPrice = selectedVariant ? selectedVariant.price : product?.price || 0;
  const discountedPrice = product?.discountedPrice;
  const hasDiscount = discountedPrice && discountedPrice < currentPrice;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold text-secondary-800 mb-4">Product Not Found</h1>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-secondary-600 mb-8"
        >
          <button onClick={() => navigate('/products')} className="flex items-center hover:text-primary-600">
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Products
          </button>
          <span>/</span>
          <span>{product.category ? product.category.name : 'Category'}</span>
          <span>/</span>
          <span className="text-secondary-800">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-2xl bg-secondary-50">
              <img
                src={product.images[selectedImageIndex]?.url || '/placeholder-image.jpg'}
                alt={product.images[selectedImageIndex]?.alt || product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-primary-500'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Brand & Name */}
            <div className="space-y-2">
              {product.brand && (
                <p className="text-sm text-primary-600 font-medium uppercase tracking-wide">
                  {product.brand}
                </p>
              )}
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-secondary-800">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            {product.rating.count > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating.average)
                          ? 'text-yellow-400'
                          : 'text-secondary-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-secondary-600">
                  ({product.rating.count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-secondary-800">
                  {hasDiscount ? formatPrice(discountedPrice!) : formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-secondary-500 line-through">
                      {formatPrice(currentPrice)}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      -{Math.round(((currentPrice - discountedPrice!) / currentPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-secondary-600">
                Inclusive of all taxes
              </p>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-lg text-secondary-600 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Colors */}
            {availableColors.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-800">
                  Available Colors:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color, index) => (
                    <span key={index} className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-800">
                  Size: <span className="font-normal">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-300 text-secondary-700 hover:border-secondary-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                currentStock > 10 ? 'bg-green-500' : currentStock > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                currentStock > 10 ? 'text-green-700' : currentStock > 0 ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {currentStock > 10 ? 'In Stock' : currentStock > 0 ? `Only ${currentStock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-secondary-800">Quantity:</label>
                <div className="flex items-center border border-secondary-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-secondary-50 transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="p-2 hover:bg-secondary-50 transition-colors"
                    disabled={quantity >= currentStock}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className="p-3 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  {isInWishlist(product._id) ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-secondary-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-secondary-200">
              <div className="flex items-center space-x-3">
                <TruckIcon className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-secondary-600">Free shipping over PKR 15,000</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-secondary-600">30-day return policy</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-display font-bold text-secondary-800 mb-6">
                Product Details
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary-800">Description</h3>
                  <div 
                    className="text-secondary-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatDescription(product.description) }}
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-secondary-800">Features</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-secondary-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Materials */}
                  {product.materials && product.materials.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-secondary-800">Materials</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.materials.map((material, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Care Instructions */}
                  {product.careInstructions && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-secondary-800">Care Instructions</h3>
                      <p className="text-secondary-600">{product.careInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProductDetail;