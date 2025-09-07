import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: '/Slider1-1.jpeg',
    title: 'Fashion',
    subtitle: 'Redefined',
    description: 'Discover the latest trends in premium Pakistani fashion'
  },
  {
    id: 2,
    image: '/Slider1-2.jpeg',
    title: 'Elegance',
    subtitle: 'Unveiled',
    description: 'Sophisticated styles for the modern woman'
  },
  {
    id: 3,
    image: '/Slider1-3.jpeg',
    title: 'Style',
    subtitle: 'Perfected',
    description: 'Curated collections that define contemporary fashion'
  },
  {
    id: 4,
    image: '/Slider1-4.jpeg',
    title: 'Luxury',
    subtitle: 'Accessible',
    description: 'Premium quality fashion at affordable prices'
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="relative h-[70vh] lg:h-[80vh] overflow-hidden rounded-2xl shadow-elegant">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop';
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-2xl space-y-6 ml-20 md:ml-16 lg:ml-20"
              >
                <div className="space-y-2 pr-16 md:pr-8 lg:pr-0">
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white leading-tight">
                    {slides[currentSlide].title}
                    <span className="block text-gradient-white">
                      {slides[currentSlide].subtitle}
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-lg md:max-w-2xl">
                    {slides[currentSlide].description}
                  </p>
                </div>
                

              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
      >
        <ChevronLeftIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
      >
        <ChevronRightIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Free Shipping Badge */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-12 left-8 bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-secondary-800">Free Shipping</div>
            <div className="text-sm text-secondary-600">On orders over PKR 15,000</div>
          </div>
        </div>
      </motion.div> */}
    </div>
  );
};

export default HeroSlider;