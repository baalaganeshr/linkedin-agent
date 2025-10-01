import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ResumeGenerator() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    headline: '',
    summary: '',
    education: [{ institution: '', degree: '', field: '', duration: '', gpa: '' }],
    experience: [{ title: '', company: '', duration: '', description: '' }],
    skills: { technical: [], soft: [] },
    technicalSkillsInput: '',
    softSkillsInput: '',
    projects: [{ name: '', description: '', technologies: [], link: '' }]
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', field: '', duration: '', gpa: '' }]
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: [], link: '' }]
    }));
  };

  const generateResume = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prepare skills arrays
      const technicalSkills = formData.technicalSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      const softSkills = formData.softSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const profileData = {
        ...formData,
        skills: {
          technical: technicalSkills,
          soft: softSkills
        }
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/generate`,
        { profileData },
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      setGeneratedResume(response.data.resume);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate resume. Please try again.');
      console.error('Resume generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000000' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #1F1F1F',
        padding: '20px 24px',
        background: '#000000'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF' }}>
            🤖 AI Resume Generator
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              color: '#71717A',
              fontSize: '14px',
              textDecoration: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '48px'
      }}>
        {/* Left: Form */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#FFFFFF',
              marginBottom: '24px',
              letterSpacing: '-0.02em'
            }}
          >
            Your Information
          </motion.h2>

          {/* Contact Info Section */}
          <FormSection title="📇 Contact Information">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@example.com"
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+91 9876543210"
            />
            <Input
              label="LinkedIn URL"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </FormSection>

          {/* Professional Summary */}
          <FormSection title="✨ Professional Summary">
            <Input
              label="Headline"
              value={formData.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              placeholder="Full-Stack Developer | Computer Science Student"
            />
            <TextArea
              label="Summary"
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Motivated CS student with experience in full-stack development..."
              rows={4}
            />
          </FormSection>

          {/* Education Section */}
          <FormSection 
            title="🎓 Education" 
            action={<AddButton onClick={addEducation}>+ Add Education</AddButton>}
          >
            {formData.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: index < formData.education.length - 1 ? '1px solid #1F1F1F' : 'none' }}>
                <Input
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[index].institution = e.target.value;
                    setFormData(prev => ({ ...prev, education: newEdu }));
                  }}
                  placeholder="University Name"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].degree = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }}
                    placeholder="B.Tech"
                  />
                  <Input
                    label="Field"
                    value={edu.field}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].field = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }}
                    placeholder="Computer Science"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input
                    label="Duration"
                    value={edu.duration}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].duration = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }}
                    placeholder="2020 - 2024"
                  />
                  <Input
                    label="GPA (Optional)"
                    value={edu.gpa}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].gpa = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }}
                    placeholder="8.5/10"
                  />
                </div>
              </div>
            ))}
          </FormSection>

          {/* Experience Section */}
          <FormSection 
            title="💼 Experience" 
            action={<AddButton onClick={addExperience}>+ Add Experience</AddButton>}
          >
            {formData.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: index < formData.experience.length - 1 ? '1px solid #1F1F1F' : 'none' }}>
                <Input
                  label="Job Title"
                  value={exp.title}
                  onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[index].title = e.target.value;
                    setFormData(prev => ({ ...prev, experience: newExp }));
                  }}
                  placeholder="Software Engineer Intern"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input
                    label="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].company = e.target.value;
                      setFormData(prev => ({ ...prev, experience: newExp }));
                    }}
                    placeholder="Tech Company Inc."
                  />
                  <Input
                    label="Duration"
                    value={exp.duration}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].duration = e.target.value;
                      setFormData(prev => ({ ...prev, experience: newExp }));
                    }}
                    placeholder="Jun 2023 - Aug 2023"
                  />
                </div>
                <TextArea
                  label="Description"
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[index].description = e.target.value;
                    setFormData(prev => ({ ...prev, experience: newExp }));
                  }}
                  placeholder="• Developed REST APIs using Node.js&#10;• Collaborated with team of 5 developers&#10;• Improved performance by 30%"
                  rows={3}
                />
              </div>
            ))}
          </FormSection>

          {/* Skills Section */}
          <FormSection title="🛠️ Skills">
            <Input
              label="Technical Skills"
              value={formData.technicalSkillsInput}
              onChange={(e) => handleInputChange('technicalSkillsInput', e.target.value)}
              placeholder="JavaScript, React, Node.js, Python, MongoDB (comma-separated)"
            />
            <Input
              label="Soft Skills"
              value={formData.softSkillsInput}
              onChange={(e) => handleInputChange('softSkillsInput', e.target.value)}
              placeholder="Communication, Leadership, Problem Solving (comma-separated)"
            />
          </FormSection>

          {/* Projects Section */}
          <FormSection 
            title="🚀 Projects" 
            action={<AddButton onClick={addProject}>+ Add Project</AddButton>}
          >
            {formData.projects.map((project, index) => (
              <div key={index} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: index < formData.projects.length - 1 ? '1px solid #1F1F1F' : 'none' }}>
                <Input
                  label="Project Name"
                  value={project.name}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[index].name = e.target.value;
                    setFormData(prev => ({ ...prev, projects: newProjects }));
                  }}
                  placeholder="E-commerce Platform"
                />
                <TextArea
                  label="Description"
                  value={project.description}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[index].description = e.target.value;
                    setFormData(prev => ({ ...prev, projects: newProjects }));
                  }}
                  placeholder="Built a full-stack e-commerce platform with React and Node.js..."
                  rows={3}
                />
                <Input
                  label="Link (Optional)"
                  value={project.link}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[index].link = e.target.value;
                    setFormData(prev => ({ ...prev, projects: newProjects }));
                  }}
                  placeholder="https://github.com/username/project"
                />
              </div>
            ))}
          </FormSection>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={generateResume}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#6D28D9' : '#8B5CF6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '32px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '20px', height: '20px' }}
                >
                  ⚙️
                </motion.div>
                Generating AI Resume...
              </>
            ) : (
              <>
                ✨ Generate AI Resume
              </>
            )}
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                color: '#EF4444',
                fontSize: '14px',
                marginTop: '16px',
                textAlign: 'center'
              }}
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* Right: Preview */}
        <div style={{
          position: 'sticky',
          top: '24px',
          height: 'fit-content'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}>
              Preview
            </h2>
            {generatedResume && (
              <button
                onClick={downloadResume}
                style={{
                  padding: '8px 16px',
                  background: '#8B5CF6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📥 Download PDF
              </button>
            )}
          </div>
          
          {generatedResume ? (
            <ResumePreview resume={generatedResume} />
          ) : (
            <div style={{
              background: '#0A0A0A',
              border: '1px solid #1F1F1F',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              minHeight: '600px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: '64px', marginBottom: '16px' }}
              >
                📄
              </motion.div>
              <p style={{ color: '#71717A', fontSize: '16px', marginBottom: '8px' }}>
                Your resume will appear here
              </p>
              <p style={{ color: '#52525B', fontSize: '14px' }}>
                Fill in your details and click generate
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Reusable Components
function FormSection({ title, children, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#0A0A0A',
        border: '1px solid #1F1F1F',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

function Input({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: 500,
        color: '#A1A1AA',
        marginBottom: '8px'
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: '#000000',
          border: '1px solid #1F1F1F',
          borderRadius: '8px',
          color: '#FFFFFF',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
        onBlur={(e) => e.target.style.borderColor = '#1F1F1F'}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: 500,
        color: '#A1A1AA',
        marginBottom: '8px'
      }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: '#000000',
          border: '1px solid #1F1F1F',
          borderRadius: '8px',
          color: '#FFFFFF',
          fontSize: '14px',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
        onBlur={(e) => e.target.style.borderColor = '#1F1F1F'}
      />
    </div>
  );
}

function AddButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        background: 'transparent',
        color: '#8B5CF6',
        border: '1px solid #8B5CF6',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(139, 92, 246, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

function ResumePreview({ resume }) {
  const content = resume.content || resume;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '48px',
        color: '#000000',
        minHeight: '800px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Contact Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.5px' }}>
          {content.contact?.name || content.fullName || 'Your Name'}
        </h1>
        <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.8 }}>
          {content.contact?.email || content.email} {content.contact?.email && '|'} {content.contact?.phone || content.phone}
          {content.contact?.linkedin && (
            <>
              <br />
              {content.contact.linkedin}
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {(content.summary || content.headline) && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '2px solid #000',
            paddingBottom: '4px'
          }}>
            Professional Summary
          </h2>
          {content.headline && (
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#111' }}>
              {content.headline}
            </p>
          )}
          {content.summary && (
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#333' }}>
              {content.summary}
            </p>
          )}
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && content.education[0].institution && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '2px solid #000',
            paddingBottom: '4px'
          }}>
            Education
          </h2>
          {content.education.map((edu, index) => (
            edu.institution && (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '14px', color: '#111' }}>{edu.institution}</strong>
                  {edu.duration && <span style={{ fontSize: '12px', color: '#666' }}>{edu.duration}</span>}
                </div>
                <div style={{ fontSize: '13px', color: '#444', marginTop: '2px' }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Experience */}
      {content.experience && content.experience.length > 0 && content.experience[0].title && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '2px solid #000',
            paddingBottom: '4px'
          }}>
            Experience
          </h2>
          {content.experience.map((exp, index) => (
            exp.title && (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '14px', color: '#111' }}>{exp.title}</strong>
                  {exp.duration && <span style={{ fontSize: '12px', color: '#666' }}>{exp.duration}</span>}
                </div>
                {exp.company && (
                  <div style={{ fontSize: '13px', color: '#444', marginBottom: '4px', fontStyle: 'italic' }}>
                    {exp.company}
                  </div>
                )}
                {exp.description && (
                  <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </div>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ fontSize: '12px', lineHeight: 1.6, paddingLeft: '20px', margin: '4px 0 0 0' }}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {content.skills && (content.skills.technical?.length > 0 || content.skills.soft?.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '2px solid #000',
            paddingBottom: '4px'
          }}>
            Skills
          </h2>
          {content.skills.technical && content.skills.technical.length > 0 && (
            <div style={{ fontSize: '13px', marginBottom: '6px' }}>
              <strong>Technical:</strong> {content.skills.technical.join(' • ')}
            </div>
          )}
          {content.skills.soft && content.skills.soft.length > 0 && (
            <div style={{ fontSize: '13px' }}>
              <strong>Soft Skills:</strong> {content.skills.soft.join(' • ')}
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {content.projects && content.projects.length > 0 && content.projects[0].name && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '2px solid #000',
            paddingBottom: '4px'
          }}>
            Projects
          </h2>
          {content.projects.map((project, index) => (
            project.name && (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '14px', color: '#111' }}>{project.name}</strong>
                  {project.link && (
                    <a href={project.link} style={{ fontSize: '11px', color: '#8B5CF6' }}>
                      View Project →
                    </a>
                  )}
                </div>
                {project.description && (
                  <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#333', margin: '4px 0' }}>
                    {project.description}
                  </p>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </motion.div>
  );
}
