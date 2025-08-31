import React from 'react';
import Layout from '../components/layout/Layout';
import { ArrowPathIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Returns: React.FC = () => {
  return (
    <Layout>
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-display font-bold text-secondary-800 mb-8 text-center">
            Returns & Exchanges
          </h1>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 text-center">
                <ClockIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold text-secondary-800 mb-2">30-Day Policy</h3>
                <p className="text-secondary-600">Return within 30 days of purchase</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 text-center">
                <ArrowPathIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold text-secondary-800 mb-2">Easy Exchange</h3>
                <p className="text-secondary-600">Hassle-free size and color exchanges</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 text-center">
                <ShieldCheckIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold text-secondary-800 mb-2">Quality Guarantee</h3>
                <p className="text-secondary-600">100% satisfaction guaranteed</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Return Policy</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-3">Eligible Items</h3>
                  <ul className="text-secondary-600 space-y-2">
                    <li>• Items must be unworn and in original condition</li>
                    <li>• All original tags must be attached</li>
                    <li>• Items must be returned within 30 days of purchase</li>
                    <li>• Original packaging should be included when possible</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-3">Non-Returnable Items</h3>
                  <ul className="text-secondary-600 space-y-2">
                    <li>• Customized or personalized items</li>
                    <li>• Items marked as final sale</li>
                    <li>• Undergarments and intimate apparel</li>
                    <li>• Items damaged by customer misuse</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-6">How to Return</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-secondary-800">Contact Us</h3>
                    <p className="text-secondary-600">Email us at rawaiti.pehnawa01@gmail.com with your order number and reason for return.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-secondary-800">Get Return Authorization</h3>
                    <p className="text-secondary-600">We'll provide you with return instructions and a return authorization number.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-secondary-800">Ship the Item</h3>
                    <p className="text-secondary-600">Package the item securely and ship it to our return address.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-secondary-800">Receive Refund</h3>
                    <p className="text-secondary-600">Once we receive and inspect the item, your refund will be processed within 5-7 business days.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Exchange Policy</h2>
              <div className="space-y-3 text-secondary-600">
                <p>• Free exchanges for different sizes or colors within 30 days</p>
                <p>• Item must be in original condition with tags attached</p>
                <p>• Subject to availability of requested size/color</p>
                <p>• Customer pays return shipping, we cover exchange shipping</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-secondary-800 mb-2">💡 Need Help?</h3>
              <p className="text-secondary-600">
                If you have any questions about returns or exchanges, please contact us at 
                rawaiti.pehnawa01@gmail.com or visit our store. We're here to help make your 
                shopping experience perfect!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Returns;