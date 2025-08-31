import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RichTextEditor from '../../components/common/RichTextEditor';
import { adminAPI } from '../../services/adminAPI';
import { Category, Product } from '../../types';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  brand: string;
  price: number;
  discountedPrice: number;
  stock: number;
  tags: string[];
  features: string[];
  materials: string[];
  careInstructions: string;
  isActive: boolean;
  isFeatured: boolean;
  variants: Array<{
    size: string;
    stock: number;
    price: number;
    sku: string;
  }>;
  colors: string[];
  images: Array<{
    url: string;
    alt: string;
    publicId?: string;
  }>;
}

const AdminProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [hasVariants, setHasVariants] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    brand: '',
    price: 0,
    discountedPrice: 0,
    stock: 0,
    tags: [],
    features: [],
    materials: [],
    careInstructions: '',
    isActive: true,
    isFeatured: false,
    variants: [],
    colors: [],
    images: []
  });

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Red', code: '#FF0000' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Green', code: '#008000' },
    { name: 'Yellow', code: '#FFFF00' },
    { name: 'Pink', code: '#FFC0CB' },
    { name: 'Purple', code: '#800080' },
    { name: 'Orange', code: '#FFA500' },
    { name: 'Brown', code: '#A52A2A' }
  ];

  useEffect(() => {
    loadCategories();
    if (isEdit && id) {
      loadProduct(id);
    }
  }, [isEdit, id]);

  const loadCategories = async () => {
    try {
      const response = await adminAPI.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getProduct(productId);
      if (response.success && response.data.product) {
        const product = response.data.product;
        setFormData({
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription || '',
          category: product.category._id,
          brand: product.brand || '',
          price: product.price,
          discountedPrice: product.discountedPrice || 0,
          stock: product.stock || 0,
          tags: product.tags,
          features: product.features,
          materials: product.materials,
          careInstructions: product.careInstructions || '',
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          variants: product.variants || [],
          colors: product.colors || [],
          images: product.images
        });
        setHasVariants(product.variants && product.variants.length > 0);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    try {
      setUploadingImages(true);
      const uploadPromises = Array.from(files).map(file => adminAPI.uploadImage(file));
      const responses = await Promise.all(uploadPromises);
      
      const newImages = responses.map(response => ({
        url: response.data.url,
        alt: formData.name,
        publicId: response.data.publicId
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));

      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    if (!hasVariants) {
      setHasVariants(true);
    }
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        size: 'M',
        stock: 0,
        price: formData.price,
        sku: `${formData.name.replace(/\s+/g, '-').toUpperCase()}-M-${Date.now()}`
      }]
    }));
  };

  // Initialize colors if empty
  useEffect(() => {
    if (formData.colors.length === 0) {
      setFormData(prev => ({
        ...prev,
        colors: ['Black']
      }));
    }
  }, []);

  const toggleVariants = (enabled: boolean) => {
    setHasVariants(enabled);
    if (!enabled) {
      setFormData(prev => ({ ...prev, variants: [] }));
    } else if (formData.variants.length === 0) {
      addVariant();
    }
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, 'Black']
    }));
  };

  const removeColor = (index: number) => {
    if (formData.colors.length > 1) {
      setFormData(prev => ({
        ...prev,
        colors: prev.colors.filter((_, i) => i !== index)
      }));
    }
  };

  const updateColor = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? value : color
      )
    }));
  };

  const handleArrayInput = (field: 'tags' | 'features' | 'materials', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strip HTML tags for validation
    const plainTextDescription = formData.description.replace(/<[^>]*>/g, '').trim();
    
    if (!formData.name || !plainTextDescription || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (hasVariants && formData.variants.length === 0) {
      toast.error('Please add at least one variant when variants are enabled');
      return;
    }

    if (formData.colors.length === 0) {
      toast.error('Please add at least one color');
      return;
    }

    try {
      setIsSaving(true);
      
      const productData = {
        ...formData,
        variants: hasVariants ? formData.variants.map(variant => ({
          ...variant,
          sku: variant.sku || `${formData.name.replace(/\s+/g, '-').toUpperCase()}-${variant.size}-${Date.now()}`
        })) : []
      };

      let response;
      if (isEdit && id) {
        response = await adminAPI.updateProduct(id, productData);
      } else {
        response = await adminAPI.createProduct(productData);
      }

      if (response.success) {
        toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update product information' : 'Create a new product for your store'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (PKR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discounted Price (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({ ...formData, discountedPrice: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available quantity in stock
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief product description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <div className="border border-gray-300 rounded-lg">
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    placeholder="Detailed product description with formatting..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Product Images</h3>
            
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500"
                >
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                    </p>
                  </div>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Variants */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                <p className="text-sm text-gray-500">Enable if product has different sizes, colors, or variations</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasVariants"
                    checked={hasVariants}
                    onChange={(e) => toggleVariants(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="hasVariants" className="ml-2 text-sm text-gray-700">
                    Enable Variants
                  </label>
                </div>
                {hasVariants && (
                  <button
                    type="button"
                    onClick={addVariant}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Variant
                  </button>
                )}
              </div>
            </div>

            {hasVariants ? (
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Variant {index + 1}</h4>
                    {formData.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                      <select
                        value={variant.size}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {sizeOptions.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        min="0"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Auto-generated if empty"
                      />
                    </div>
                  </div>
                </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Variants are disabled. Enable variants to add different sizes, colors, or variations.</p>
              </div>
            )}
          </div>

          {/* Product Colors */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Product Colors</h3>
                <p className="text-sm text-gray-500">Add available colors for this product</p>
              </div>
              <button
                type="button"
                onClick={addColor}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Color
              </button>
            </div>

            <div className="space-y-4">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Black, White, Red"
                    />
                  </div>
                  {formData.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Additional Information</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleArrayInput('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="fashion, clothing, trendy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.features.join(', ')}
                  onChange={(e) => handleArrayInput('features', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="comfortable, durable, stylish"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.materials.join(', ')}
                  onChange={(e) => handleArrayInput('materials', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="cotton, polyester, spandex"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care Instructions
                </label>
                <textarea
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Machine wash cold, tumble dry low"
                />
              </div>

              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                    Featured Product
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;