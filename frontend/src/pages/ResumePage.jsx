// Resume Page - AI-powered resume generation
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, ArrowLeft, Plus, Trash2, Copy, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const ResumePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    country: 'India',
    targetRole: '',
    skills: {
      technical: [''],
      soft: ['']
    },
    experience: [{ company: '', role: '', duration: '', description: '' }],
    education: [{ school: '', degree: '', year: '', gpa: '' }],
    projects: [{ name: '', description: '', link: '' }]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (type, index, value) => {
    const newSkills = { ...formData.skills };
    newSkills[type][index] = value;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = (type) => {
    const newSkills = { ...formData.skills };
    newSkills[type].push('');
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const removeSkill = (type, index) => {
    const newSkills = { ...formData.skills };
    newSkills[type].splice(index, 1);
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (arrayName, template) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], template] }));
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = [...formData[arrayName]];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.targetRole) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/resume-test/generate', formData);
      
      if (response.data.success) {
        setGeneratedResume(response.data.resume);
        toast.success('Resume generated successfully! 🎉');
      }
    } catch (error) {
      console.error('Resume generation error:', error);
      toast.error(error.response?.data?.details || error.response?.data?.error || 'Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedResume) {
      navigator.clipboard.writeText(JSON.stringify(generatedResume, null, 2));
      toast.success('Copied to clipboard!');
    }
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
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">AI Resume Builder</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Your Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    required
                  />
                  
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    required
                  />
                  
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="LinkedIn Profile URL"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="India">India</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Global">Global</option>
                  </select>
                  
                  <input
                    type="text"
                    name="targetRole"
                    placeholder="Target Role (e.g., Software Developer) *"
                    value={formData.targetRole}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Technical Skills</h3>
                  {formData.skills.technical.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange('technical', index, e.target.value)}
                        placeholder="e.g., Python, React, AWS"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <button type="button" onClick={() => removeSkill('technical', index)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSkill('technical')} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Technical Skill
                  </button>
                </div>

                {/* Soft Skills */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Soft Skills</h3>
                  {formData.skills.soft.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange('soft', index, e.target.value)}
                        placeholder="e.g., Leadership, Communication"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <button type="button" onClick={() => removeSkill('soft', index)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSkill('soft')} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Soft Skill
                  </button>
                </div>

                {/* Experience */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Work Experience</h3>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/10">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                        placeholder="Company Name"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)}
                        placeholder="Role/Position"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)}
                        placeholder="Duration (e.g., Jan 2023 - Present)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                        placeholder="Description of your responsibilities and achievements"
                        rows="3"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <button type="button" onClick={() => removeArrayItem('experience', index)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', description: '' })} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Experience
                  </button>
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Education</h3>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/10">
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)}
                        placeholder="School/University Name"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                        placeholder="Degree (e.g., B.Tech in Computer Science)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                          placeholder="Year (e.g., 2020-2024)"
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                          placeholder="GPA/CGPA"
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('education', index)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('education', { school: '', degree: '', year: '', gpa: '' })} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>

                {/* Projects */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Projects</h3>
                  {formData.projects.map((project, index) => (
                    <div key={index} className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/10">
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                        placeholder="Project Name"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <textarea
                        value={project.description}
                        onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                        placeholder="Project Description"
                        rows="2"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                        placeholder="Project Link (GitHub, Demo, etc.)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <button type="button" onClick={() => removeArrayItem('projects', index)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('projects', { name: '', description: '', link: '' })} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate AI-Powered Resume
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Resume Display Section */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Generated Resume</h2>
                {generatedResume && (
                  <div className="flex gap-2">
                    <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Copy to clipboard">
                      <Copy className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Download">
                      <Download className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>

              {generatedResume ? (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-black/50 p-6 rounded-lg border border-white/10 space-y-4 text-gray-300 whitespace-pre-wrap font-mono text-sm">
                    {JSON.stringify(generatedResume, null, 2)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Fill out the form and click "Generate" to see your AI-powered resume here</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumePage;