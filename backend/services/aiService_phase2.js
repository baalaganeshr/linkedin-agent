// PHASE 2: MOCK AI SERVICE - Real Groq implementation comes in Phase 3
// TODO: Implement Groq API later - this is just mock data for testing

class AIService {
  async generateResume(profileData) {
    // Mock resume data - replace with real AI call later
    return {
      contact: {
        name: profileData.fullName,
        email: profileData.email,
        phone: "+91 9876543210",
        linkedin: "linkedin.com/in/user"
      },
      summary: "Motivated Computer Science student with experience in full-stack development and AI systems.",
      education: profileData.education || [{
        institution: "Sample University",
        degree: "B.Tech",
        field: "Computer Science",
        duration: "2021-2025"
      }],
      experience: profileData.experience || [{
        title: "Software Developer Intern",
        company: "Tech Company",
        duration: "Jun 2024 - Aug 2024",
        achievements: ["Built features", "Improved performance by 25%"]
      }],
      skills: {
        technical: profileData.skills || ["JavaScript", "React", "Node.js", "MongoDB"],
        soft: ["Problem Solving", "Team Collaboration", "Communication"]
      },
      projects: [{
        name: "LinkedInScholar",
        description: "LinkedIn automation platform for students",
        technologies: ["React", "Node.js", "MongoDB"]
      }]
    };
  }

  async optimizeProfile(profileData) {
    // Mock optimization data
    return {
      profileScore: 65,
      headline: {
        current: profileData.headline || "Student",
        improved: "Computer Science Student | Full-Stack Developer | AI Enthusiast",
        reason: "Added specific skills and interests"
      },
      quickWins: [
        "Add professional photo",
        "Get 3 recommendations",
        "Update headline with keywords"
      ]
    };
  }

  async generateNetworkingMessage(connectionData) {
    // Mock networking message
    return {
      message: `Hi ${connectionData.name || 'there'}, I noticed your work in ${connectionData.field || 'technology'} and would love to connect!`,
      subject: "Let's connect!",
      tips: [
        "Personalize the message further",
        "Mention specific common interests",
        "Keep it concise and professional"
      ]
    };
  }
}

module.exports = new AIService();