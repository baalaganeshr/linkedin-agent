// Profile Page - LinkedIn profile optimization
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, ArrowLeft, Copy, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [optimization, setOptimization] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    headline: '',
    summary: '',
    targetRole: '',
    country: 'India',
    skills: ['']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setFormData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.headline || !formData.targetRole) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/profile-test/optimize', formData);
      
      if (response.data.success) {
        setOptimization(response.data.optimization);
        toast.success('Profile optimized successfully! 🎉');
      }
    } catch (error) {
      console.error('Profile optimization error:', error);
      toast.error(error.response?.data?.details || error.response?.data?.error || 'Failed to optimize profile');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Profile Optimizer</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                Your LinkedIn Profile
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />

                <input
                  type="text"
                  name="headline"
                  placeholder="Current Headline (e.g., Computer Science Student) *"
                  value={formData.headline}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />

                <textarea
                  name="summary"
                  placeholder="Current Summary/About Section"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />

                <input
                  type="text"
                  name="targetRole"
                  placeholder="Target Role (e.g., Software Engineer) *"
                  value={formData.targetRole}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="India">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Global">Global</option>
                </select>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Key Skills</label>
                  {formData.skills.map((skill, index) => (
                    <input
                      key={index}
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      placeholder={`Skill ${index + 1}`}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addSkill}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add Skill
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Optimize Profile with AI
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Results Section */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6">AI Suggestions</h2>

              {optimization ? (
                <div className="space-y-6">
                  {/* Profile Score */}
                  {optimization.profileScore && (
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="text-sm text-blue-300 mb-1">Profile Score</div>
                      <div className="text-3xl font-bold text-blue-400">{optimization.profileScore}/100</div>
                    </div>
                  )}

                  {/* Optimized Headline */}
                  {optimization.optimizedHeadline && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-blue-400">✨ Optimized Headline</h3>
                        <button onClick={() => copyToClipboard(optimization.optimizedHeadline)} className="p-2 hover:bg-white/10 rounded-lg">
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-white/10 text-gray-300">
                        {optimization.optimizedHeadline}
                      </div>
                    </div>
                  )}

                  {/* Optimized Summary */}
                  {optimization.optimizedSummary && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-blue-400">✨ Optimized Summary</h3>
                        <button onClick={() => copyToClipboard(optimization.optimizedSummary)} className="p-2 hover:bg-white/10 rounded-lg">
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-white/10 text-gray-300 whitespace-pre-wrap">
                        {optimization.optimizedSummary}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {optimization.suggestions && optimization.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-blue-400">💡 Improvement Suggestions</h3>
                      <ul className="space-y-2">
                        {optimization.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Raw Response (for debugging) */}
                  <details className="text-xs">
                    <summary className="text-gray-400 cursor-pointer">View Raw AI Response</summary>
                    <pre className="mt-2 bg-black/50 p-4 rounded-lg border border-white/10 text-gray-400 overflow-auto">
                      {JSON.stringify(optimization, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Fill out your profile information and click "Optimize" to get AI-powered suggestions</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;