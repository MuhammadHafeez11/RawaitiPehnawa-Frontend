import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn items with original tags. Items must be in original condition for a full refund."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within Pakistan. Express shipping is available for 1-2 business days delivery."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within Pakistan. We are working on expanding our shipping to international locations soon."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash on delivery, bank transfers, and online payments through JazzCash and EasyPaisa."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via SMS and email. You can use this to track your package."
    },
    {
      question: "What sizes do you offer?",
      answer: "We offer sizes from XS to XXL. Please check our size guide for detailed measurements to ensure the perfect fit."
    },
    {
      question: "Can I exchange an item for a different size?",
      answer: "Yes, you can exchange items for a different size within 30 days, provided the item is unworn and has original tags."
    },
    {
      question: "How do I care for my Pakistani clothing?",
      answer: "Most of our items require gentle hand washing or dry cleaning. Always check the care label on each garment for specific instructions."
    }
  ];

  return (
    <Layout>
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-display font-bold text-secondary-800 mb-8 text-center">
            Frequently Asked Questions
          </h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-secondary-200">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-secondary-50 transition-colors"
                >
                  <span className="font-semibold text-secondary-800">{faq.question}</span>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-secondary-600 transition-transform ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-secondary-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-secondary-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <a 
              href="mailto:rawaiti.pehnawa01@gmail.com"
              className="btn-primary inline-flex items-center"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default FAQ;