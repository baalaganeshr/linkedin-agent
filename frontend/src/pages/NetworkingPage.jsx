// Networking Page - AI-powered networking suggestions
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, ArrowLeft, Copy, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const NetworkingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    targetRole: '',
    targetIndustry: '',
    location: 'India',
    country: 'India'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.targetRole || !formData.targetIndustry) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/networking-test/suggestions', formData);
      
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
        toast.success('Networking suggestions generated! 🎉');
      }
    } catch (error) {
      console.error('Networking error:', error);
      toast.error(error.response?.data?.details || error.response?.data?.error || 'Failed to generate suggestions');
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-400" />
                Your Networking Goals
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your Full Name *"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  required
                />

                <input
                  type="text"
                  name="targetRole"
                  placeholder="Target Role (e.g., Software Engineer) *"
                  value={formData.targetRole}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  required
                />

                <input
                  type="text"
                  name="targetIndustry"
                  placeholder="Target Industry (e.g., Technology, Finance) *"
                  value={formData.targetIndustry}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  required
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Preferred Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="India">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Global">Global</option>
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Suggestions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get AI Networking Suggestions
                    </>
                  )}
                </button>
              </form>

              {/* Tips */}
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="text-sm font-semibold text-green-400 mb-2">💡 Pro Tips</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Connect with alumni from your university</li>
                  <li>• Personalize your connection messages</li>
                  <li>• Engage with their content before reaching out</li>
                  <li>• Follow up within 2-3 days</li>
                </ul>
              </div>
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
              <h2 className="text-2xl font-bold mb-6">Networking Suggestions</h2>

              {suggestions ? (
                <div className="space-y-6">
                  {/* Connection Suggestions */}
                  {suggestions.connectionSuggestions && suggestions.connectionSuggestions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-green-400 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        People to Connect With
                      </h3>
                      {suggestions.connectionSuggestions.map((person, index) => (
                        <div key={index} className="bg-black/50 p-4 rounded-lg border border-white/10 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium text-white">{person.name || person.title}</div>
                              <div className="text-sm text-gray-400">{person.role || person.description}</div>
                              {person.company && <div className="text-sm text-gray-500">{person.company}</div>}
                            </div>
                            <Linkedin className="w-5 h-5 text-blue-400" />
                          </div>
                          {person.reason && (
                            <div className="text-xs text-gray-400 bg-white/5 p-2 rounded">
                              <strong>Why:</strong> {person.reason}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Templates */}
                  {suggestions.messageTemplates && suggestions.messageTemplates.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-green-400 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Connection Message Templates
                      </h3>
                      {suggestions.messageTemplates.map((template, index) => (
                        <div key={index} className="bg-black/50 p-4 rounded-lg border border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-400">Template {index + 1}</div>
                            <button
                              onClick={() => copyToClipboard(template.message || template)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                          <div className="text-gray-300 text-sm whitespace-pre-wrap">
                            {template.message || template}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Networking Strategy */}
                  {suggestions.strategy && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-green-400">🎯 Networking Strategy</h3>
                      <div className="bg-black/50 p-4 rounded-lg border border-white/10 text-gray-300 text-sm whitespace-pre-wrap">
                        {suggestions.strategy}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {suggestions.tips && suggestions.tips.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-green-400">💡 Additional Tips</h3>
                      <ul className="space-y-1">
                        {suggestions.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Raw Response (for debugging) */}
                  <details className="text-xs">
                    <summary className="text-gray-400 cursor-pointer">View Raw AI Response</summary>
                    <pre className="mt-2 bg-black/50 p-4 rounded-lg border border-white/10 text-gray-400 overflow-auto max-h-64">
                      {JSON.stringify(suggestions, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Fill out your networking goals and click "Get Suggestions" to receive AI-powered connection recommendations</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NetworkingPage;