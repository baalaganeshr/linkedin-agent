// Upgrade Page - Premium subscription
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, ArrowLeft, Zap, Users, FileText, Target, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UpgradePage = () => {
  const navigate = useNavigate();
  const { isPremium } = useAuth();

  const features = [
    {
      icon: FileText,
      title: 'Unlimited Resume Generation',
      description: 'Create as many AI-powered resumes as you need',
      free: '3 resumes',
      premium: 'Unlimited'
    },
    {
      icon: Users,
      title: 'Advanced Networking AI',
      description: 'Get unlimited networking suggestions and message templates',
      free: '10 suggestions',
      premium: 'Unlimited'
    },
    {
      icon: Target,
      title: 'Profile Optimization+',
      description: 'Deep LinkedIn profile analysis with actionable insights',
      free: '5 optimizations',
      premium: 'Unlimited'
    },
    {
      icon: Zap,
      title: 'Priority AI Processing',
      description: 'Faster response times and latest AI models',
      free: 'Standard',
      premium: 'Priority'
    },
    {
      icon: Star,
      title: 'Premium Templates',
      description: 'Access to exclusive resume and message templates',
      free: 'Basic templates',
      premium: 'Premium collection'
    }
  ];

  const handleUpgrade = () => {
    // Implement payment integration here
    console.log('Upgrade to premium');
  };

  if (isPremium) {
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
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white">Premium Member</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Premium Status */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center mx-auto">
              <Crown className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white">
              You're a Premium Member! 🎉
            </h2>
            
            <p className="text-gray-400 max-w-md mx-auto">
              Enjoy unlimited access to all LinkedInScholar AI features.
            </p>

            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl p-8 border border-yellow-500/30 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Premium Benefits Active</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Unlimited AI features</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Priority processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Premium templates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Advanced analytics</span>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

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
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Upgrade to Premium</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center mx-auto">
            <Crown className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-white">
            Unlock Your Professional Potential
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get unlimited access to AI-powered career tools designed specifically 
            for college students in India. Build your network, optimize your profile, 
            and land your dream job.
          </p>

          {/* Pricing */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-8 py-4">
            <span className="text-3xl font-bold text-purple-400">₹299</span>
            <span className="text-gray-300">/month</span>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium ml-2">
              Student Special
            </span>
          </div>
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Compare Plans
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-white mb-2">Free Plan</h4>
                <p className="text-gray-400 text-sm">Perfect for getting started</p>
                <div className="text-2xl font-bold text-gray-300 mt-4">₹0</div>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <feature.icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white text-sm">{feature.title}</div>
                      <div className="text-gray-400 text-xs">{feature.free}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 relative overflow-hidden">
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>

              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-white mb-2">Premium Plan</h4>
                <p className="text-gray-400 text-sm">Unlimited AI-powered features</p>
                <div className="text-2xl font-bold text-purple-400 mt-4">₹299/month</div>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <feature.icon className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white text-sm">{feature.title}</div>
                      <div className="text-purple-300 text-xs font-medium">{feature.premium}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02]"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h4 className="font-semibold text-white mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400 text-sm">
                Yes, you can cancel your subscription anytime. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h4 className="font-semibold text-white mb-2">Is this really designed for students?</h4>
              <p className="text-gray-400 text-sm">
                Absolutely! Our AI is trained specifically on the Indian job market and college student profiles. All suggestions are tailored for students and new graduates.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h4 className="font-semibold text-white mb-2">How accurate is the AI?</h4>
              <p className="text-gray-400 text-sm">
                Our AI uses the latest models and is constantly updated with current industry trends and hiring practices in India. We maintain a 98% satisfaction rate among our users.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UpgradePage;