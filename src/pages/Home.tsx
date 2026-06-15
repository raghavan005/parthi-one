import { Link, useNavigate } from "react-router-dom";
import { products } from "../lib/data";
import { ArrowRight, Package, ShieldCheck, Factory } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="py-12 md:py-24 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full"
        >
          <Factory size={16} />
          <span>Industrial Grade Bag Stitching</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900"
        >
          Precision manufacturing <br className="hidden md:block"/> for growing brands.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
        >
          Reliable supply, consistent quality, and quick turnarounds. 
          We manufacture Non-Woven, Cotton, and Canvas bags at scale.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
        >
          <button 
            onClick={() => navigate('/request-quote')}
            className="inline-flex items-center justify-center h-12 px-8 font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors focus:ring-4 focus:ring-slate-200"
          >
            Request Custom Quote
            <ArrowRight size={18} className="ml-2" />
          </button>
          
          <button 
            onClick={() => {
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center h-12 px-8 font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Explore Catalog
          </button>
        </motion.div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="space-y-10 scroll-m-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Standard Catalog</h2>
            <p className="text-slate-500">Base models ready for customization and bulk order.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              key={product.id}
              className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm shadow-sm text-slate-800">
                    {product.tag}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 space-y-4">
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{product.specs}</p>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2">
                  <p className="text-sm text-slate-500">Base Price</p>
                  <p className="text-xl font-bold text-slate-900">₹{product.basePrice.toFixed(2)}<span className="text-sm font-normal text-slate-500">/pc</span></p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
                <button
                  onClick={() => navigate(`/request-quote?material=${encodeURIComponent(product.name)}`)}
                  className="w-full inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Customize This
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="border-t border-slate-200 py-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} FactoryQuote. All rights reserved.</p>
      </footer>
    </div>
  );
}
