import React from 'react';
import Layout from '../components/layout/Layout';
import { MapPinIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
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
            Contact Us
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPinIcon className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Visit Our Store</h3>
                    <p className="text-secondary-600">
                      Bahria Town Phase 6<br />
                      Empire Heights 2, Block B<br />
                      Ground Floor, Shop No 8<br />
                      Islamabad, Pakistan 44000
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <EnvelopeIcon className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Email Us</h3>
                    <p className="text-secondary-600">rawaiti.pehnawa01@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <ClockIcon className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Store Hours</h3>
                    <div className="text-secondary-600 space-y-1">
                      <p>Monday - Saturday: 10:00 AM - 9:00 PM</p>
                      <p>Sunday: 12:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary py-3"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contact;