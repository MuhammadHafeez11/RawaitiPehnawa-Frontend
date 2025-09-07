import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Product, ProductVariant } from '../../types';
import { useGuestCart } from '../../context/GuestCartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/currency';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isHovered, setIsHovered] = useState(false);
  
  const { addToCart } = useGuestCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentStock = selectedVariant ? selectedVariant.stock : (product.stock || 0);
    if (currentStock === 0) {
      toast.error('This item is out of stock');
      return;
    }

    if (selectedVariant) {
      addToCart(product, selectedVariant, 1);
    } else {
      // Create a default variant for products without variants
      const currentPrice = product.discountedPrice && product.discountedPrice < product.price 
        ? product.discountedPrice 
        : product.price;
      const defaultVariant: ProductVariant = {
        size: 'One Size',
        stock: product.stock || 0,
        price: currentPrice,
        sku: `${product._id}-default`
      };
      addToCart(product, defaultVariant, 1);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };



  const availableSizes = product.variants ? product.variants.map(v => v.size) : [];

  return (
    <div 
      className={`product-card group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl">
          <img
            src={product.images[0]?.url || '/placeholder-image.jpg'}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price && (
              <span className="badge-error text-xs font-bold">
                -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
              </span>
            )}
            {product.isFeatured && (
              <span className="badge-primary text-xs font-bold">
                Featured
              </span>
            )}
            {(selectedVariant ? selectedVariant.stock === 0 : (product.stock || 0) === 0) && (
              <span className="badge bg-secondary-600 text-white text-xs font-bold">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={handleWishlistToggle}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            >
              {isWishlisted ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-secondary-600" />
              )}
            </button>
            <Link
              to={`/product/${product.slug}`}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            >
              <EyeIcon className="w-5 h-5 text-secondary-600" />
            </Link>
          </div>

          {/* Quick Add to Cart */}
          <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant ? selectedVariant.stock === 0 : (product.stock || 0) === 0}
              className="w-full btn-primary py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBagIcon className="w-4 h-4 inline mr-2" />
              {(selectedVariant ? selectedVariant.stock === 0 : (product.stock || 0) === 0) ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-secondary-500 uppercase tracking-wide font-medium">
              {product.brand}
            </p>
          )}

          {/* Name */}
          <h3 className="font-semibold text-secondary-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-secondary-800">
              {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price 
                ? formatPrice(product.discountedPrice)
                : formatPrice(product.price)
              }
            </span>
            {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price && (
              <span className="text-sm text-secondary-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating.count > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating.average)
                        ? 'text-yellow-400'
                        : 'text-secondary-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-secondary-500">
                ({product.rating.count})
              </span>
            </div>
          )}



          {/* Stock Status */}
          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${
              (selectedVariant ? selectedVariant.stock : (product.stock || 0)) > 10 
                ? 'text-green-600' 
                : (selectedVariant ? selectedVariant.stock : (product.stock || 0)) > 0 
                ? 'text-yellow-600' 
                : 'text-red-600'
            }`}>
              {selectedVariant 
                ? (selectedVariant.stock > 10 ? 'In Stock' : selectedVariant.stock > 0 ? `Only ${selectedVariant.stock} left` : 'Out of Stock')
                : ((product.stock || 0) > 10 ? 'In Stock' : (product.stock || 0) > 0 ? `Only ${product.stock} left` : 'Out of Stock')
              }
            </span>
            <span className="text-secondary-500">
              {product.soldCount} sold
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;