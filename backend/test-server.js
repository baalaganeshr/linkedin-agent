// Test server for LinkedInScholar FREE version
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'LinkedInScholar FREE Version - Test Server Running! 🚀',
    version: '2.0-FREE',
    ai: 'Groq (FREE - 14,400 requests/day)',
    database: 'MongoDB Atlas (FREE - 512MB)', 
    cost: '₹0 per month',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    groqConfigured: process.env.GROQ_API_KEY ? 'Yes ✅' : 'No ❌ - Add GROQ_API_KEY to .env',
    mongoConfigured: process.env.MONGODB_URI ? 'Yes ✅' : 'No ❌ - Add MONGODB_URI to .env',
    linkedinConfigured: process.env.LINKEDIN_CLIENT_ID ? 'Yes ✅' : 'No ❌ - Add LinkedIn credentials to .env'
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to LinkedInScholar FREE API! 🎓',
    version: '2.0-FREE',
    docs: '/api/health for system status',
    setup: 'Add your FREE API keys to .env file'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 LinkedInScholar FREE Test Server running on port ${PORT}`);
  console.log(`💰 Total cost: ₹0 (FREE version)`);
  console.log(`⚡ AI: Groq FREE API`);
  console.log(`🗄️  Database: MongoDB Atlas FREE`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/api/health`);
  console.log(`📝 Next: Add your FREE API keys to .env file`);
});