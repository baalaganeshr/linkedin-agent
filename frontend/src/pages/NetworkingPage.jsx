// Networking Page - AI-powered networking suggestions
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NetworkingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Networking Assistant</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white">
            Networking Assistant Coming Soon
          </h2>
          
          <p className="text-gray-400 max-w-md mx-auto">
            Get AI-powered networking suggestions to build meaningful professional 
            connections and grow your career in India.
          </p>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Features Coming Soon:</h3>
            <ul className="text-left space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span>AI-powered connection recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span>Personalized message templates</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span>Industry networking strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span>Alumni network discovery</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span>Follow-up reminders and tips</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NetworkingPage;