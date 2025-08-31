import React from 'react';
import Layout from '../components/layout/Layout';
import { TruckIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Shipping: React.FC = () => {
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
            Shipping Information
          </h1>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 text-center">
                <TruckIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold text-secondary-800 mb-2">Free Shipping</h3>
                <p className="text-secondary-600">On orders over PKR 15,000</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 text-center">
                <ClockIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold text-secondary-800 mb-2">Fast Delivery</h3>
                <p className="text-secondary-600">3-5 business days nationwide</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 text-center">
                <MapPinIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold text-secondary-800 mb-2">Pakistan Wide</h3>
                <p className="text-secondary-600">We deliver across Pakistan</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Shipping Options</h2>
              
              <div className="space-y-6">
                <div className="border-b border-secondary-200 pb-4">
                  <h3 className="font-semibold text-secondary-800 mb-2">Standard Shipping (3-5 Business Days)</h3>
                  <p className="text-secondary-600 mb-2">Perfect for regular orders with no rush.</p>
                  <ul className="text-secondary-600 space-y-1">
                    <li>• FREE for orders over PKR 15,000</li>
                    <li>• PKR 200 for orders under PKR 15,000</li>
                    <li>• Available nationwide</li>
                  </ul>
                </div>
                
                <div className="border-b border-secondary-200 pb-4">
                  <h3 className="font-semibold text-secondary-800 mb-2">Express Shipping (1-2 Business Days)</h3>
                  <p className="text-secondary-600 mb-2">For urgent orders and special occasions.</p>
                  <ul className="text-secondary-600 space-y-1">
                    <li>• PKR 500 for all orders</li>
                    <li>• Available in major cities</li>
                    <li>• Order before 2 PM for same-day processing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-2">Cash on Delivery</h3>
                  <p className="text-secondary-600 mb-2">Pay when you receive your order.</p>
                  <ul className="text-secondary-600 space-y-1">
                    <li>• Available for all shipping options</li>
                    <li>• Additional PKR 50 COD charges apply</li>
                    <li>• Exact change appreciated</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Order Processing</h2>
              <div className="space-y-3 text-secondary-600">
                <p>• Orders are processed within 1-2 business days</p>
                <p>• You'll receive a confirmation email with tracking information</p>
                <p>• Orders placed on weekends are processed on Monday</p>
                <p>• During sale periods, processing may take 2-3 business days</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-secondary-800 mb-2">📦 Packaging</h3>
              <p className="text-secondary-600">
                All orders are carefully packaged to ensure your items arrive in perfect condition. 
                We use eco-friendly packaging materials whenever possible.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Shipping;