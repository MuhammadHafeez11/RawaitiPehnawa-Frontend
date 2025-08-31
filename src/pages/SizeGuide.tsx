import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const SizeGuide: React.FC = () => {
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
            Size Guide
          </h1>
          
          <div className="space-y-8">
            <div className="bg-primary-50 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-4">How to Measure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-2">Bust/Chest</h3>
                  <p className="text-secondary-600">Measure around the fullest part of your bust/chest, keeping the tape parallel to the floor.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-2">Waist</h3>
                  <p className="text-secondary-600">Measure around your natural waistline, which is the narrowest part of your torso.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-2">Hips</h3>
                  <p className="text-secondary-600">Measure around the fullest part of your hips, about 8 inches below your waist.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-2">Length</h3>
                  <p className="text-secondary-600">For tops, measure from shoulder to desired length. For bottoms, measure from waist to ankle.</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Women's Clothing Size Chart</h2>
              <table className="w-full border-collapse border border-secondary-300">
                <thead>
                  <tr className="bg-secondary-100">
                    <th className="border border-secondary-300 px-4 py-2">Size</th>
                    <th className="border border-secondary-300 px-4 py-2">Bust (inches)</th>
                    <th className="border border-secondary-300 px-4 py-2">Waist (inches)</th>
                    <th className="border border-secondary-300 px-4 py-2">Hips (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-secondary-300 px-4 py-2">XS</td><td className="border border-secondary-300 px-4 py-2">32-34</td><td className="border border-secondary-300 px-4 py-2">24-26</td><td className="border border-secondary-300 px-4 py-2">34-36</td></tr>
                  <tr><td className="border border-secondary-300 px-4 py-2">S</td><td className="border border-secondary-300 px-4 py-2">34-36</td><td className="border border-secondary-300 px-4 py-2">26-28</td><td className="border border-secondary-300 px-4 py-2">36-38</td></tr>
                  <tr><td className="border border-secondary-300 px-4 py-2">M</td><td className="border border-secondary-300 px-4 py-2">36-38</td><td className="border border-secondary-300 px-4 py-2">28-30</td><td className="border border-secondary-300 px-4 py-2">38-40</td></tr>
                  <tr><td className="border border-secondary-300 px-4 py-2">L</td><td className="border border-secondary-300 px-4 py-2">38-40</td><td className="border border-secondary-300 px-4 py-2">30-32</td><td className="border border-secondary-300 px-4 py-2">40-42</td></tr>
                  <tr><td className="border border-secondary-300 px-4 py-2">XL</td><td className="border border-secondary-300 px-4 py-2">40-42</td><td className="border border-secondary-300 px-4 py-2">32-34</td><td className="border border-secondary-300 px-4 py-2">42-44</td></tr>
                  <tr><td className="border border-secondary-300 px-4 py-2">XXL</td><td className="border border-secondary-300 px-4 py-2">42-44</td><td className="border border-secondary-300 px-4 py-2">34-36</td><td className="border border-secondary-300 px-4 py-2">44-46</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-secondary-800 mb-2">💡 Sizing Tips</h3>
              <ul className="text-secondary-600 space-y-2">
                <li>• If you're between sizes, we recommend choosing the larger size for comfort</li>
                <li>• Pakistani clothing tends to have a relaxed fit - check individual product descriptions</li>
                <li>• For traditional wear like shalwar kameez, consider cultural fitting preferences</li>
                <li>• Contact us if you need help choosing the right size</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SizeGuide;