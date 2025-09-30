// Groq AI Service for LinkedInScholar (100% FREE - 14,400 requests/day)
const Groq = require('groq-sdk');

class AIService {
  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is required. Get it FREE from https://console.groq.com/');
    }
    
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    // Free Groq models available
    this.models = {
      fast: 'llama-3.1-8b-instant',      // Fastest, good for quick tasks
      balanced: 'llama-3.1-70b-versatile', // Best balance of speed/quality
      creative: 'mixtral-8x7b-32768'     // Most creative for content generation
    };
  }

  /**
   * Generate professional resume optimized for Indian job market
   */
  async generateResume(profileData) {
    const prompt = `Generate a professional ATS-optimized resume in JSON format for an Indian college student.

Profile Data:
- Name: ${profileData.fullName || 'Student Name'}
- Email: ${profileData.email || 'student@example.com'}
- Headline: ${profileData.headline || 'Computer Science Student'}
- Summary: ${profileData.summary || 'Motivated student seeking opportunities'}
- Experience: ${JSON.stringify(profileData.experience || [])}
- Education: ${JSON.stringify(profileData.education || [])}
- Skills: ${JSON.stringify(profileData.skills || [])}
- Target Role: ${profileData.targetRole || 'Software Developer'}

Create a resume optimized for Indian job market with:
- Action verbs and quantified achievements
- ATS-friendly keywords
- Indian contact format (+91 phone, Indian locations)
- Skills relevant to Indian tech companies
- Projects that show practical application

Return ONLY valid JSON with this exact structure:
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+91 XXXXXXXXXX",
    "linkedin": "https://linkedin.com/in/profile",
    "location": "City, State, India",
    "github": "https://github.com/username"
  },
  "summary": "2-3 sentence professional summary highlighting key skills and career goals for entry-level position in Indian market",
  "education": [
    {
      "institution": "University/College Name",
      "degree": "Bachelor of Technology",
      "field": "Computer Science Engineering",
      "duration": "2021 - 2025",
      "gpa": "8.5/10",
      "location": "City, State, India",
      "achievements": ["Dean's List", "Academic Excellence Award"]
    }
  ],
  "experience": [
    {
      "title": "Software Development Intern",
      "company": "Company Name",
      "duration": "Jun 2024 - Aug 2024",
      "location": "City, India",
      "type": "Internship",
      "achievements": [
        "Developed web application using React and Node.js, increasing user engagement by 25%",
        "Collaborated with team of 5 developers using Agile methodology",
        "Implemented RESTful APIs serving 1000+ daily requests"
      ]
    }
  ],
  "skills": {
    "technical": ["JavaScript", "React", "Node.js", "MongoDB", "Python", "Java", "Git", "AWS"],
    "soft": ["Problem Solving", "Team Collaboration", "Communication", "Leadership", "Time Management"]
  },
  "projects": [
    {
      "name": "E-commerce Web Application",
      "description": "Full-stack e-commerce platform with user authentication and payment integration",
      "technologies": ["React", "Node.js", "MongoDB", "Stripe API"],
      "duration": "Mar 2024 - May 2024",
      "achievements": [
        "Built responsive frontend serving 500+ concurrent users",
        "Implemented secure payment processing with 99.9% uptime",
        "Deployed on AWS with CI/CD pipeline"
      ],
      "github": "https://github.com/username/ecommerce-app",
      "demo": "https://project-demo.com"
    }
  ],
  "certifications": [
    "AWS Certified Cloud Practitioner",
    "Google Cloud Associate Engineer",
    "MongoDB Certified Developer"
  ],
  "achievements": [
    "Winner - College Hackathon 2024",
    "Published research paper on Machine Learning",
    "Led team of 10 students in technical society"
  ]
}`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.models.balanced,
        temperature: 0.7,
        max_tokens: 3000,
        top_p: 0.8
      });

      const text = completion.choices[0].message.content.trim();
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const cleanText = jsonMatch[0];
      const resumeData = JSON.parse(cleanText);
      
      // Validate required fields
      if (!resumeData.contact || !resumeData.summary) {
        throw new Error('Invalid resume structure generated');
      }
      
      return resumeData;
      
    } catch (error) {
      console.error('Groq AI Resume Generation Error:', error);
      return this.getFallbackResume(profileData);
    }
  }

  /**
   * Optimize LinkedIn profile with personalized suggestions
   */
  async optimizeProfile(profileData) {
    const prompt = `Analyze this LinkedIn profile for an Indian college student and provide detailed optimization suggestions.

Current Profile:
- Name: ${profileData.fullName || 'Student'}
- Headline: ${profileData.headline || 'Student'}
- Summary: ${profileData.summary || 'No summary provided'}
- Experience: ${JSON.stringify(profileData.experience || [])}
- Education: ${JSON.stringify(profileData.education || [])}
- Skills: ${JSON.stringify(profileData.skills || [])}
- Industry Focus: ${profileData.industry || 'Technology'}

Provide optimization suggestions for Indian job market focusing on:
- Keywords relevant to Indian recruiters
- Industry-specific terminology
- Achievement quantification
- Professional networking in India

Return JSON with structure:
{
  "profileScore": 75,
  "headline": {
    "current": "current headline text",
    "improved": "Computer Science Student | React Developer | Seeking SDE Role at Top Indian Tech Companies",
    "reason": "Added specific skills and career intent with Indian market focus"
  },
  "summary": {
    "issues": ["Too generic", "No quantified achievements", "Missing industry keywords"],
    "improved": "Passionate Computer Science student with hands-on experience in full-stack development. Built 5+ web applications using React and Node.js. Seeking Software Developer role at innovative Indian startups. Experienced in Agile development and collaborative coding.",
    "tips": [
      "Add specific project numbers and metrics",
      "Include technologies relevant to Indian companies",
      "Mention collaboration and team skills",
      "Add career aspirations specific to Indian market"
    ]
  },
  "skills": {
    "missingSkills": ["System Design", "Data Structures", "Algorithms", "Docker", "Kubernetes"],
    "skillsToHighlight": ["JavaScript", "React", "Problem Solving", "Team Leadership"],
    "industrySpecific": ["MERN Stack", "Microservices", "Cloud Computing", "DevOps"]
  },
  "quickWins": [
    "Add professional headshot photo",
    "Get 3+ recommendations from professors/colleagues",
    "Update headline with target role and key skills",
    "Join relevant Indian tech groups and communities",
    "Share technical articles or project updates weekly"
  ]
}`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.models.balanced,
        temperature: 0.7,
        max_tokens: 2500
      });

      const text = completion.choices[0].message.content.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
      
    } catch (error) {
      console.error('Groq AI Profile Optimization Error:', error);
      return this.getFallbackProfileOptimization();
    }
  }

  /**
   * Generate networking suggestions for Indian job market
   */
  async generateNetworkingSuggestions(userProfile, targetRole = 'Software Developer') {
    const prompt = `Generate networking suggestions for an Indian college student looking for ${targetRole} opportunities.

Student Profile:
- Name: ${userProfile.fullName}
- Education: ${JSON.stringify(userProfile.education || [])}
- Skills: ${JSON.stringify(userProfile.skills || [])}
- Experience: ${JSON.stringify(userProfile.experience || [])}
- Location: ${userProfile.location || 'India'}

Provide networking strategy for Indian job market including:
- Target companies and roles
- Connection message templates
- Industry events and communities
- Professional development suggestions

Return JSON:
{
  "targetCompanies": [
    {
      "name": "Flipkart",
      "role": "Software Development Engineer",
      "why": "Great for e-commerce experience and startup culture",
      "keyPeople": ["Engineering Managers", "Senior SDEs", "Campus Recruiters"],
      "approach": "Highlight relevant projects and passion for e-commerce"
    }
  ],
  "connectionMessages": [
    {
      "type": "Alumni Connection",
      "template": "Hi [Name], I'm a final year CSE student at [University]. I noticed you're working as [Role] at [Company]. I'd love to learn about your journey from campus to industry. Would you be open to a brief conversation about your experience?",
      "personalization": "Mention specific projects or achievements from their profile"
    }
  ],
  "events": [
    {
      "name": "Bangalore Tech Meetup",
      "type": "In-person networking",
      "frequency": "Monthly",
      "benefit": "Meet local developers and startup founders"
    }
  ],
  "communities": [
    "GDG Bangalore",
    "ReactJS Bangalore", 
    "JavaScript Developers India",
    "[City] Developers Community"
  ]
}`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.models.creative,
        temperature: 0.8,
        max_tokens: 2000
      });

      const text = completion.choices[0].message.content.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
      
    } catch (error) {
      console.error('Groq AI Networking Error:', error);
      return this.getFallbackNetworkingSuggestions();
    }
  }

  /**
   * Generate personalized connection message
   */
  async generateConnectionMessage(targetProfile, userProfile, context = 'general') {
    const prompt = `Generate a personalized LinkedIn connection message for an Indian college student.

Student: ${userProfile.fullName} (${userProfile.headline || 'Computer Science Student'})
Target: ${targetProfile.name} (${targetProfile.role || 'Professional'} at ${targetProfile.company || 'Company'})
Context: ${context}

Requirements:
- Professional but friendly tone
- Mention specific reason for connecting
- Keep under 300 characters (LinkedIn limit)
- Appropriate for Indian professional context
- Show genuine interest and value proposition

Generate 3 different message options:
{
  "messages": [
    {
      "type": "Brief & Professional",
      "text": "Hi [Name], I'm a CSE student interested in [Company/Role]. Your work in [specific area] is inspiring. Would love to connect and learn from your experience!",
      "length": 150
    },
    {
      "type": "Project-based",
      "text": "Hello [Name], I recently built a [project type] similar to your work at [Company]. I'd appreciate connecting to learn from your expertise in [technology/domain].",
      "length": 180
    },
    {
      "type": "Career-focused", 
      "text": "Hi [Name], As an aspiring [role] looking to start my career in [industry], I'd value connecting with experienced professionals like you at [Company].",
      "length": 160
    }
  ]
}`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.models.fast,
        temperature: 0.6,
        max_tokens: 800
      });

      const text = completion.choices[0].message.content.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
      
    } catch (error) {
      console.error('Groq AI Message Generation Error:', error);
      return this.getFallbackConnectionMessages();
    }
  }

  // Fallback methods for when AI fails
  getFallbackResume(profileData) {
    return {
      contact: {
        name: profileData.fullName || 'Student Name',
        email: profileData.email || 'student@example.com',
        phone: '+91 XXXXXXXXXX',
        linkedin: 'https://linkedin.com/in/profile',
        location: 'City, State, India'
      },
      summary: 'Motivated Computer Science student with passion for technology and problem-solving. Seeking opportunities to apply academic knowledge in real-world projects.',
      education: [{
        institution: 'University Name',
        degree: 'Bachelor of Technology',
        field: 'Computer Science Engineering',
        duration: '2021 - 2025',
        gpa: '8.0/10'
      }],
      experience: [],
      skills: {
        technical: ['JavaScript', 'Python', 'Java', 'HTML/CSS', 'Git'],
        soft: ['Problem Solving', 'Team Collaboration', 'Communication']
      },
      projects: [],
      certifications: []
    };
  }

  getFallbackProfileOptimization() {
    return {
      profileScore: 60,
      headline: {
        current: 'Student',
        improved: 'Computer Science Student | Full Stack Developer | Seeking SDE Opportunities',
        reason: 'Added specific skills and career intent'
      },
      summary: {
        issues: ['Too generic', 'No achievements mentioned'],
        improved: 'Passionate Computer Science student with hands-on experience in web development. Built multiple projects using modern technologies. Seeking software development opportunities.',
        tips: ['Add specific technologies', 'Include project achievements', 'Mention career goals']
      },
      skills: {
        missingSkills: ['React', 'Node.js', 'MongoDB', 'AWS'],
        skillsToHighlight: ['JavaScript', 'Problem Solving']
      },
      quickWins: [
        'Add professional photo',
        'Update headline with target role',
        'Get recommendations from professors'
      ]
    };
  }

  getFallbackNetworkingSuggestions() {
    return {
      targetCompanies: [{
        name: 'TCS',
        role: 'Software Engineer',
        why: 'Great training programs for freshers',
        approach: 'Highlight academic projects and learning attitude'
      }],
      connectionMessages: [{
        type: 'General',
        template: 'Hi [Name], I\'m a Computer Science student interested in learning about the industry. Would love to connect!',
        personalization: 'Mention their current role or company'
      }],
      communities: ['Local developer groups', 'College alumni networks']
    };
  }

  getFallbackConnectionMessages() {
    return {
      messages: [
        {
          type: 'Professional',
          text: 'Hi [Name], I\'m a CS student interested in your work at [Company]. Would love to connect and learn!',
          length: 100
        }
      ]
    };
  }
}

module.exports = new AIService();