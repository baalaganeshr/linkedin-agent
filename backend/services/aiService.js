// Multi-Provider AI Service for LinkedInScholar - OPEN SOURCE & FLEXIBLE!
// Supports: Groq (FREE), Ollama (LOCAL), OpenAI (PAID), Google Gemini (FREE), Anthropic, Hugging Face
const axios = require('axios');
const logger = require('../config/logger');

class AIService {
  constructor() {
    // Detect available AI providers
    this.providers = this.detectAvailableProviders();
    this.currentProvider = this.selectBestProvider();
    
    logger.info(`AI Service initialized with: ${this.currentProvider.name}`);
    logger.info(`Cost: ${this.currentProvider.cost}`);
    
    // Initialize the selected provider
    this.initializeProvider();
  }

  /**
   * Detect which AI providers are available
   */
  detectAvailableProviders() {
    const providers = [];
    
    // 1. Groq (FREE - 14,400 requests/day)
    if (process.env.GROQ_API_KEY) {
      providers.push({
        name: 'Groq',
        type: 'api',
        cost: 'FREE (14,400/day)',
        priority: 8,
        models: {
          fast: 'llama-3.1-8b-instant',
          balanced: 'llama-3.1-70b-versatile',
          creative: 'mixtral-8x7b-32768'
        }
      });
    }
    
    // 2. Ollama (LOCAL - Completely FREE)
    // Note: checkOllamaLocal is now async, but called synchronously here for constructor
    // Ollama detection primarily relies on OLLAMA_HOST env variable
    if (process.env.OLLAMA_HOST) {
      providers.push({
        name: 'Ollama',
        type: 'local',
        cost: 'FREE (Local, Unlimited)',
        priority: 10, // Highest priority - completely free and unlimited
        host: process.env.OLLAMA_HOST || 'http://localhost:11434',
        models: {
          fast: process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b',
          balanced: process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b', 
          creative: process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b'
        }
      });
    }
    
    // 3. Google Gemini (FREE tier available)
    if (process.env.GEMINI_API_KEY) {
      providers.push({
        name: 'Google Gemini',
        type: 'api',
        cost: 'FREE tier available',
        priority: 7,
        models: {
          fast: 'gemini-1.5-flash',
          balanced: 'gemini-1.5-pro',
          creative: 'gemini-1.5-pro'
        }
      });
    }
    
    // 4. Hugging Face (FREE with rate limits)
    if (process.env.HUGGINGFACE_API_KEY) {
      providers.push({
        name: 'Hugging Face',
        type: 'api',
        cost: 'FREE (with limits)',
        priority: 6,
        models: {
          fast: 'microsoft/DialoGPT-medium',
          balanced: 'microsoft/DialoGPT-large',
          creative: 'huggingface/CodeBERTa-small-v1'
        }
      });
    }
    
    // 5. OpenAI (PAID but popular)
    if (process.env.OPENAI_API_KEY) {
      providers.push({
        name: 'OpenAI',
        type: 'api',
        cost: 'PAID ($)',
        priority: 5,
        models: {
          fast: 'gpt-3.5-turbo',
          balanced: 'gpt-4o-mini',
          creative: 'gpt-4o'
        }
      });
    }
    
    // 6. Fallback: Template-based (NO API NEEDED)
    providers.push({
      name: 'Template-Based',
      type: 'template',
      cost: 'FREE (No API)',
      priority: 1, // Lowest priority but always available
      models: {
        fast: 'template',
        balanced: 'template',
        creative: 'template'
      }
    });
    
    return providers;
  }

  /**
   * Check if Ollama is running locally
   */
  async checkOllamaLocal() {
    try {
      const response = await axios.get('http://localhost:11434/api/version', {
        timeout: 2000 // 2 second timeout
      });
      logger.info('Ollama detected locally:', response.data);
      return true;
    } catch (error) {
      logger.debug('Ollama not available locally:', error.message);
      return false;
    }
  }

  /**
   * Select the best available provider
   */
  selectBestProvider() {
    if (this.providers.length === 0) {
      throw new Error('No AI providers available! Please configure at least one.');
    }
    
    // Sort by priority (higher = better)
    return this.providers.sort((a, b) => b.priority - a.priority)[0];
  }

  /**
   * Initialize the selected provider
   */
  initializeProvider() {
    switch (this.currentProvider.name) {
      case 'Groq':
        const Groq = require('groq-sdk');
        this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        break;
      case 'OpenAI':
        // Would initialize OpenAI client
        break;
      case 'Ollama':
        // Ollama uses HTTP requests, no special client needed
        this.ollamaHost = this.currentProvider.host;
        break;
      default:
        // Template-based needs no initialization
        break;
    }
  }

  /**
   * Get regional configuration for global markets
   */
  getRegionConfig(country) {
    const regions = {
      'US': {
        marketName: 'US job market',
        contactFormat: 'US format (xxx-xxx-xxxx)',
        topCompanies: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'],
        resumeStyle: '1-page achievement-focused',
        phoneFormat: '+1',
        locationFormat: 'City, State, USA'
      },
      'UK': {
        marketName: 'UK job market',
        contactFormat: 'UK format (+44)',
        topCompanies: ['DeepMind', 'Revolut', 'Monzo', 'ARM', 'BAE Systems'],
        resumeStyle: '2-page CV format',
        phoneFormat: '+44',
        locationFormat: 'City, UK'
      },
      'CA': {
        marketName: 'Canadian job market',
        contactFormat: 'Canadian format',
        topCompanies: ['Shopify', 'BlackBerry', 'Ubisoft', 'Thomson Reuters'],
        resumeStyle: '1-2 page format',
        phoneFormat: '+1',
        locationFormat: 'City, Province, Canada'
      },
      'IN': {
        marketName: 'Indian job market',
        contactFormat: 'Indian format (+91)',
        topCompanies: ['TCS', 'Infosys', 'Wipro', 'Flipkart', 'Zomato'],
        resumeStyle: 'detailed technical format',
        phoneFormat: '+91',
        locationFormat: 'City, State, India'
      },
      'DE': {
        marketName: 'German job market',
        contactFormat: 'German format (+49)',
        topCompanies: ['SAP', 'Siemens', 'BMW', 'Mercedes-Benz', 'Volkswagen'],
        resumeStyle: 'structured detailed format',
        phoneFormat: '+49',
        locationFormat: 'City, Germany'
      },
      'AU': {
        marketName: 'Australian job market',
        contactFormat: 'Australian format (+61)',
        topCompanies: ['Atlassian', 'Canva', 'Afterpay', 'REA Group'],
        resumeStyle: '2-page detailed format',
        phoneFormat: '+61',
        locationFormat: 'City, State, Australia'
      },
      'FR': {
        marketName: 'French job market',
        contactFormat: 'French format (+33)',
        topCompanies: ['Dassault Systèmes', 'Thales', 'Capgemini', 'Atos'],
        resumeStyle: 'detailed CV format',
        phoneFormat: '+33',
        locationFormat: 'City, France'
      },
      'SG': {
        marketName: 'Singapore job market',
        contactFormat: 'Singapore format (+65)',
        topCompanies: ['Grab', 'Sea Limited', 'DBS', 'Shopee'],
        resumeStyle: '1-2 page format',
        phoneFormat: '+65',
        locationFormat: 'Singapore'
      },
      'NL': {
        marketName: 'Dutch job market',
        contactFormat: 'Dutch format (+31)',
        topCompanies: ['ASML', 'Philips', 'ING', 'Adyen'],
        resumeStyle: '2-page detailed format',
        phoneFormat: '+31',
        locationFormat: 'City, Netherlands'
      },
      'SE': {
        marketName: 'Swedish job market',
        contactFormat: 'Swedish format (+46)',
        topCompanies: ['Spotify', 'Klarna', 'Volvo', 'Ericsson'],
        resumeStyle: 'concise Swedish format',
        phoneFormat: '+46',
        locationFormat: 'City, Sweden'
      },
      'global': {
        marketName: 'global job market',
        contactFormat: 'international format',
        topCompanies: ['tech companies worldwide', 'multinational corporations'],
        resumeStyle: 'internationally accepted format',
        phoneFormat: '+country-code',
        locationFormat: 'City, Country'
      }
    };
    
    return regions[country] || regions['global'];
  }

  /**
   * Generate professional resume optimized for global job markets
   */
  async generateResume(profileData) {
    // Get regional configuration
    const region = this.getRegionConfig(profileData.country || 'global');
    
    const prompt = `Generate a professional ATS-optimized resume in JSON format for a college student targeting ${region.marketName}.

Profile Data:
- Name: ${profileData.fullName || 'Student Name'}
- Email: ${profileData.email || 'student@example.com'}
- Country: ${profileData.country || 'Global'}
- Headline: ${profileData.headline || 'Computer Science Student'}
- Summary: ${profileData.summary || 'Motivated student seeking opportunities'}
- Experience: ${JSON.stringify(profileData.experience || [])}
- Education: ${JSON.stringify(profileData.education || [])}
- Skills: ${JSON.stringify(profileData.skills || [])}
- Target Role: ${profileData.targetRole || 'Software Developer'}

Create a resume optimized for ${region.marketName} with:
- Action verbs and quantified achievements
- ATS-friendly keywords for ${region.marketName}
- ${region.contactFormat} contact format
- Skills relevant to ${region.topCompanies.join(', ')}
- Projects that show practical application

Return ONLY valid JSON with this exact structure:
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "${region.phoneFormat} XXXXXXXXXX",
    "linkedin": "https://linkedin.com/in/profile",
    "location": "${region.locationFormat}",
    "github": "https://github.com/username"
  },
  "summary": "2-3 sentence professional summary highlighting key skills and career goals for entry-level position in ${region.marketName}",
  "education": [
    {
      "institution": "University/College Name",
      "degree": "Bachelor's Degree",
      "field": "Computer Science",
      "duration": "2021 - 2025",
      "gpa": "3.8/4.0",
      "location": "${region.locationFormat}",
      "achievements": ["Dean's List", "Academic Excellence Award"]
    }
  ],
  "experience": [
    {
      "title": "Software Development Intern",
      "company": "Company Name",
      "duration": "Jun 2024 - Aug 2024",
      "location": "${region.locationFormat}",
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
      logger.info(`Generating resume using ${this.currentProvider.name}`);
      return await this.callAIProvider(prompt, 'resume');
      
    } catch (error) {
      logger.error(`${this.currentProvider.name} failed:`, error.message);
      logger.info('Trying fallback method...');
      return this.getFallbackResume(profileData);
    }
  }

  /**
   * Universal AI provider caller
   */
  async callAIProvider(prompt, type = 'general') {
    switch (this.currentProvider.name) {
      case 'Groq':
        return await this.callGroq(prompt);
      case 'Ollama':
        return await this.callOllama(prompt);
      case 'Google Gemini':
        return await this.callGemini(prompt);
      case 'Hugging Face':
        return await this.callHuggingFace(prompt);
      case 'OpenAI':
        return await this.callOpenAI(prompt);
      default:
        return this.getFallbackResponse(prompt, type);
    }
  }

  /**
   * Groq API call
   */
  async callGroq(prompt) {
    const completion = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: this.currentProvider.models.balanced,
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 0.8
    });

    const text = completion.choices[0].message.content.trim();
    return this.parseAIResponse(text);
  }

  /**
   * Ollama API call (Local, completely FREE!)
   */
  async callOllama(prompt) {
    const response = await axios.post(`${this.ollamaHost}/api/generate`, {
      model: this.currentProvider.models.balanced,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.8
      }
    });

    return this.parseAIResponse(response.data.response);
  }

  /**
   * Google Gemini API call
   */
  async callGemini(prompt) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.currentProvider.models.balanced}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3000
        }
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    return this.parseAIResponse(text);
  }

  /**
   * Parse AI response to extract JSON
   */
  parseAIResponse(text) {
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
  }

  /**
   * Optimize LinkedIn profile with personalized suggestions for global markets
   */
  async optimizeProfile(profileData) {
    const region = this.getRegionConfig(profileData.country || 'global');
    
    const prompt = `Analyze this LinkedIn profile for a college student targeting ${region.marketName} and provide detailed optimization suggestions.

Current Profile:
- Name: ${profileData.fullName || 'Student'}
- Country: ${profileData.country || 'Global'}
- Headline: ${profileData.headline || 'Student'}
- Summary: ${profileData.summary || 'No summary provided'}
- Experience: ${JSON.stringify(profileData.experience || [])}
- Education: ${JSON.stringify(profileData.education || [])}
- Skills: ${JSON.stringify(profileData.skills || [])}
- Industry Focus: ${profileData.industry || 'Technology'}

Provide optimization suggestions for ${region.marketName} focusing on:
- Keywords relevant to ${region.marketName} recruiters
- Industry-specific terminology for ${region.marketName}
- Achievement quantification standards for ${region.marketName}
- Professional networking culture in ${region.marketName}

Return JSON with structure:
{
  "profileScore": 75,
  "headline": {
    "current": "current headline text",
    "improved": "Computer Science Student | React Developer | Seeking SDE Role at Top Tech Companies",
    "reason": "Added specific skills and career intent with regional market focus"
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
      logger.error('Groq AI Profile Optimization Error:', error);
      return this.getFallbackProfileOptimization();
    }
  }

  /**
   * Generate networking suggestions for global job markets
   */
  async generateNetworkingSuggestions(userProfile, targetRole = 'Software Developer') {
    const region = this.getRegionConfig(userProfile.country || 'global');
    
    const prompt = `Generate networking suggestions for a college student targeting ${region.marketName} looking for ${targetRole} opportunities.

Student Profile:
- Name: ${userProfile.fullName}
- Country: ${userProfile.country || 'Global'}
- Education: ${JSON.stringify(userProfile.education || [])}
- Skills: ${JSON.stringify(userProfile.skills || [])}
- Experience: ${JSON.stringify(userProfile.experience || [])}
- Location: ${userProfile.location || region.locationFormat}

Provide networking strategy for ${region.marketName} including:
- Target companies and roles
- Connection message templates
- Industry events and communities
- Professional development suggestions

Return JSON:
{
  "targetCompanies": [
    {
      "name": "${region.topCompanies[0]}",
      "role": "Software Development Engineer",
      "why": "Leading company in ${region.marketName} with great career opportunities",
      "keyPeople": ["Engineering Managers", "Senior SDEs", "Campus Recruiters"],
      "approach": "Highlight relevant projects and technical skills"
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
      logger.error('Groq AI Networking Error:', error);
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
      logger.error('Groq AI Message Generation Error:', error);
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
