'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, ChevronDown } from 'lucide-react';

export default function CategorySelector({ selectedCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
          <div className="h-10 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30 relative z-10">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Tag className="w-4 h-4 inline mr-1" />
        Chọn danh mục
      </label>
      
      <div className="relative z-20">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full glass-input flex items-center justify-between"
        >
          <span className={selectedCategory ? 'text-gray-800' : 'text-gray-500'}>
            {selectedCategory ? 
              categories.find(c => c._id === selectedCategory)?.name || 'Chọn danh mục' 
              : 'Chọn danh mục'
            }
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-[9999] w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => {
                  onCategoryChange(category._id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/20 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="font-medium text-gray-800">{category.name}</div>
                {category.description && (
                  <div className="text-sm text-gray-600">{category.description}</div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}