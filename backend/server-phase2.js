const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

// Try to connect to database, but don't fail if it's not available
connectDB().catch(() => {
  console.log('Database not available - running in mock mode');
});

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Use Phase 2 routes
app.use('/api/auth', require('./routes/auth_phase2'));
app.use('/api/resume', require('./routes/resume_phase2'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    phase: 'Phase 2 - Infrastructure Only'
  });
});

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'LinkedInScholar Phase 2 - Infrastructure Only',
    phase: 'Authentication, Database, Routing ready',
    next: 'Phase 3 will add AI functionality',
    status: 'Ready for frontend testing'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 LinkedInScholar Phase 2 Server running on port ${PORT}`);
  console.log(`📋 Phase: Infrastructure Only (Authentication + Database + Routes)`);
  console.log(`🔜 Next: Phase 3 will add AI functionality`);
});