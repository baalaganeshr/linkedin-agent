// Dashboard Page - Main application dashboard with dark theme
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  Users, 
  Crown, 
  TrendingUp, 
  Target,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  Plus,
  ArrowRight,
  BookOpen,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout, isPremium, getUsageStats } = useAuth();
  const navigate = useNavigate();
  const [usageStats, setUsageStats] = useState(null);

  useEffect(() => {
    if (user) {
      setUsageStats(getUsageStats());
    }
  }, [user, getUsageStats]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const quickActions = [
    {
      title: 'Generate Resume',
      description: 'Create AI-powered resume in minutes',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/resume'),
      usage: usageStats?.resumesGenerated
    },
    {
      title: 'Optimize Profile',
      description: 'Get LinkedIn profile improvement tips',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/profile'),
      usage: usageStats?.profileOptimizations
    },
    {
      title: 'Network Suggestions',
      description: 'Find relevant connections and opportunities',
      icon: Users,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/networking'),
      usage: usageStats?.networkingSuggestions
    }
  ];

  const recentActivity = [
    { action: 'Resume generated', time: '2 hours ago', type: 'resume' },
    { action: 'Profile optimized', time: '1 day ago', type: 'profile' },
    { action: 'New networking suggestion', time: '2 days ago', type: 'networking' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                LinkedInScholar
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* Premium Badge */}
              {isPremium && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-3 py-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Premium</span>
                </div>
              )}

              {/* Notifications */}
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-3">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-sm font-medium hidden sm:block">
                  {user?.firstName}
                </span>
              </div>

              {/* Settings */}
              <button 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Open settings"
                type="button"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                aria-label="Sign out of your account"
                type="button"
              >
                <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-gray-400">
            Ready to boost your professional network today?
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {usageStats?.resumesGenerated?.current || 0}
            </h3>
            <p className="text-gray-400 text-sm">Resumes Generated</p>
            <div className="mt-3 text-xs text-gray-500">
              Limit: {usageStats?.resumesGenerated?.limit || 'N/A'}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {usageStats?.profileOptimizations?.current || 0}
            </h3>
            <p className="text-gray-400 text-sm">Profile Optimizations</p>
            <div className="mt-3 text-xs text-gray-500">
              Limit: {usageStats?.profileOptimizations?.limit || 'N/A'}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {usageStats?.networkingSuggestions?.current || 0}
            </h3>
            <p className="text-gray-400 text-sm">Networking Actions</p>
            <div className="mt-3 text-xs text-gray-500">
              Limit: {usageStats?.networkingSuggestions?.limit || 'N/A'}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Quick Actions
            </h3>
            
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{action.title}</h4>
                        <p className="text-gray-400 text-sm">{action.description}</p>
                        {action.usage && (
                          <div className="mt-2 text-xs text-gray-500">
                            Used: {action.usage.current}/{action.usage.limit}
                            {!action.usage.canUse && (
                              <span className="text-red-400 ml-2">Limit reached</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              ))}

              {/* Premium Upgrade */}
              {!isPremium && (
                <motion.button
                  onClick={() => navigate('/upgrade')}
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Upgrade to Premium</h4>
                        <p className="text-gray-400 text-sm">Unlock unlimited AI features</p>
                        <div className="mt-2 text-purple-400 text-sm font-medium">
                          ₹299/month - Student Special
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Recent Activity
            </h3>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 divide-y divide-white/10">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Calendar className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No recent activity</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Start using features to see your activity here
                  </p>
                </div>
              )}
            </div>

            {/* Learning Resources */}
            <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Tips for Success
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Complete your LinkedIn profile to 100%</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Connect with 5 new professionals weekly</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Share industry insights regularly</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;