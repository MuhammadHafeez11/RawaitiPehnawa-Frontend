import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const About: React.FC = () => {
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
            About Rawaiti Pehnawa
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-secondary-600 mb-8 text-center">
              Celebrating Pakistani fashion with modern elegance and traditional craftsmanship.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Our Story</h2>
                <p className="text-secondary-600 leading-relaxed">
                  Rawaiti Pehnawa was born from a passion for authentic Pakistani fashion. We believe in 
                  preserving the rich heritage of Pakistani clothing while embracing contemporary designs 
                  that resonate with modern women.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Our Mission</h2>
                <p className="text-secondary-600 leading-relaxed">
                  To provide high-quality, stylish Pakistani clothing that empowers women to express 
                  their cultural identity with confidence and grace. Every piece is carefully curated 
                  to ensure exceptional quality and timeless appeal.
                </p>
              </div>
            </div>
            
            <div className="bg-primary-50 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-6 text-center">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold text-secondary-800 mb-2">Authentic Designs</h3>
                  <p className="text-secondary-600">Traditional Pakistani patterns with modern cuts</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-secondary-800 mb-2">Premium Quality</h3>
                  <p className="text-secondary-600">Carefully selected fabrics and expert craftsmanship</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-secondary-800 mb-2">Customer First</h3>
                  <p className="text-secondary-600">Dedicated support and satisfaction guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default About;