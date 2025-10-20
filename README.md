# LinkedInScholar 🎓

AI-powered LinkedIn guidance platform for college students to create professional resumes, optimize profiles, and build meaningful networks.

## ✨ Features

### 🎯 Core Tools (Fully Functional)
- **📄 AI Resume Builder** - Generate ATS-optimized resumes with AI assistance
- **💼 Profile Optimizer** - Get AI-powered suggestions to improve your LinkedIn profile
- **🤝 Networking Assistant** - Receive intelligent connection suggestions and message templates

### 🎨 UI/UX
- Modern dark theme with glassmorphism design
- Responsive layouts for all devices
- Smooth animations with Framer Motion
- Loading states and error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas - free tier)
- AI Provider: Groq API (free) or Ollama (local)

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/linkedin-agent.git
cd linkedin-agent

# Install dependencies
npm run install:all
```

### 2. Backend Setup

```bash
cd backend

# Create .env file (see below for configuration)
# Edit .env with your credentials

# Start backend server
npm run dev
```

**Backend .env configuration:**
```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB (get free at https://cloud.mongodb.com)
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/linkedin-scholar

# JWT
JWT_SECRET=your-secret-key-at-least-64-characters-long
JWT_EXPIRE=7d

# AI Provider (choose ONE)
# Option 1: Groq (FREE - 14,400 requests/day) - RECOMMENDED
GROQ_API_KEY=gsk_your_groq_api_key_here

# Option 2: Ollama (Local, unlimited)
# OLLAMA_HOST=http://localhost:11434
# OLLAMA_MODEL=qwen2.5-coder:7b
```

### 3. Frontend Setup

```bash
cd frontend

# Start frontend dev server
npm run dev
```

### 4. Test the App

Open `http://localhost:5173` and test the features:
- **Resume Builder**: `http://localhost:5173/resume`
- **Profile Optimizer**: `http://localhost:5173/profile`
- **Networking Assistant**: `http://localhost:5173/networking`

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Axios, React Router, React Hot Toast

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Groq AI / Ollama (free AI options)
- JWT authentication, Helmet, CORS, Rate limiting

## � Project Structure

```
linkedin-agent/
├── backend/
│   ├── .env                    # Environment configuration
│   ├── server.js               # Express server
│   ├── routes/
│   │   ├── resume_test.js      # Resume API (no auth)
│   │   ├── profile_test.js     # Profile API (no auth)
│   │   ├── networking_test.js  # Networking API (no auth)
│   │   ├── resume_free.js      # Resume API (with auth)
│   │   ├── profile_free.js     # Profile API (with auth)
│   │   └── networking_free.js  # Networking API (with auth)
│   ├── services/
│   │   └── aiService.js        # Multi-provider AI service
│   ├── models/                 # MongoDB schemas
│   └── middleware/             # Auth, validation, error handling
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ResumePage.jsx       # Resume builder
│   │   │   ├── ProfilePage.jsx      # Profile optimizer
│   │   │   └── NetworkingPage.jsx   # Networking assistant
│   │   ├── components/         # Reusable components
│   │   └── contexts/           # React contexts
│   └── package.json
│
└── README.md
```

## 🔧 API Endpoints

### Test Endpoints (No Authentication)
- `POST /api/resume-test/generate` - Generate resume
- `POST /api/profile-test/optimize` - Optimize profile
- `POST /api/networking-test/suggestions` - Get networking suggestions

### Production Endpoints (With Authentication)
- `POST /api/resume/generate` - Generate resume (requires JWT)
- `POST /api/profile/analyze` - Analyze profile (requires JWT)
- `POST /api/networking/suggestions` - Get suggestions (requires JWT)

## 🎯 Development Status

### ✅ Completed
- Backend API endpoints (test & production)
- Frontend pages with full forms
- AI service integration (Groq/Ollama/OpenAI)
- Error handling and loading states
- CORS configuration
- Environment setup

### 🔄 Optional (For Later)
- LinkedIn OAuth integration
- User authentication system
- Payment integration for premium
- Deployment to production

## 🐛 Troubleshooting

**Backend won't start?**
- Check `.env` file exists and has correct values
- Verify MongoDB connection string is valid
- Run `npm install` in backend folder

**Frontend can't connect to backend?**
- Ensure backend is running on port 5000
- Check CORS settings in `server.js`
- Verify frontend calls `http://localhost:5000`

**AI not generating responses?**
- Check AI API key is valid (Groq/OpenAI)
- For Ollama: ensure it's running with `ollama list`
- Check backend console for error messages

## 📝 Configuration

### Get Free API Keys

**MongoDB Atlas (FREE 512MB):**
1. Go to https://cloud.mongodb.com
2. Create account and cluster
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

**Groq AI (FREE 14,400/day):**
1. Go to https://console.groq.com
2. Create account
3. Generate API key
4. Add to `.env` as `GROQ_API_KEY`

**Ollama (Local, Unlimited):**
1. Install from https://ollama.ai
2. Run: `ollama pull qwen2.5-coder:7b`
3. Add to `.env`: `OLLAMA_HOST=http://localhost:11434`

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - See LICENSE file for details.

## 🙏 Acknowledgments

- Built with React, Node.js, and MongoDB
- AI powered by Groq / Ollama
- Icons by Lucide React
- Styled with Tailwind CSS

---

**Ready to get started?** Follow the Quick Start guide above! 🚀
│   │   │   └── api.js                # Axios API service layer
│   │   ├── App.jsx                   # Main app with routing
│   │   └── main.jsx                  # React entry point
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── vite.config.js               # Vite build configuration
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Google Gemini API key
- LinkedIn OAuth credentials

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/linkedin-scholar

# JWT Security
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/callback

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd linkedin-scholar
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Start MongoDB**
```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Start the backend server**
```bash
cd backend
npm run dev
```

6. **Start the frontend development server**
```bash
cd frontend
npm run dev
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/health

## 🔧 API Endpoints

### Authentication
- `GET /api/auth/linkedin` - Get LinkedIn OAuth URL
- `POST /api/auth/linkedin/callback` - Handle LinkedIn callback
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/usage` - Get usage statistics

### Resume Management
- `POST /api/resume/generate` - Generate AI resume
- `GET /api/resume` - Get user's resumes
- `GET /api/resume/:id` - Get specific resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume

### Profile Optimization
- `POST /api/profile/analyze` - Analyze LinkedIn profile
- `GET /api/profile/optimizations` - Get optimization history

### Networking Assistant
- `GET /api/networking/suggestions` - Get networking suggestions
- `POST /api/networking/message` - Generate connection message
- `GET /api/networking/history` - Get networking history

## 🎯 Key Features Breakdown

### 1. Authentication System
- **LinkedIn OAuth 2.0** integration for seamless login
- **JWT tokens** with refresh mechanism for security
- **Usage tracking** to enforce subscription limits
- **Profile management** with LinkedIn data sync

### 2. AI Resume Builder
- **Industry-specific** resume generation using Google Gemini
- **ATS optimization** for Indian job market
- **Multiple templates** with professional formatting
- **Real-time editing** and instant preview
- **PDF export** functionality

### 3. LinkedIn Profile Optimizer
- **Comprehensive analysis** of LinkedIn profiles
- **Keyword optimization** suggestions
- **Industry benchmarking** against successful profiles
- **Action-oriented recommendations** for improvement

### 4. Networking Assistant
- **Smart connection suggestions** based on career goals
- **Personalized message templates** for outreach
- **Industry insights** for targeted networking
- **Follow-up reminders** and tracking

### 5. Subscription Management
- **Freemium model** with generous free tier
- **Usage monitoring** with real-time limits
- **Seamless upgrade** experience
- **Student-friendly pricing** at ₹299/month

## 🔒 Security Features

- **Input validation** on all endpoints
- **Rate limiting** to prevent abuse
- **CORS protection** with whitelisted origins
- **Secure headers** via Helmet.js
- **JWT token expiration** and refresh mechanism
- **Environment-based configuration**

## 📊 Usage Analytics

The platform tracks usage across all features:
- Resume generations (Free: 3, Premium: Unlimited)
- Profile optimizations (Free: 5, Premium: Unlimited)  
- Networking suggestions (Free: 10, Premium: Unlimited)
- AI interactions and response times

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin-scholar
CORS_ORIGIN=https://your-domain.com
```

### Deployment Commands
```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && npm start
```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test

# E2E tests
npm run test:e2e
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering our intelligent features
- **LinkedIn** for providing OAuth integration
- **MongoDB** for reliable data storage
- **Tailwind CSS** for beautiful, responsive design
- **React ecosystem** for robust frontend development

## 📞 Support

For support, email support@linkedinscholar.com or join our Slack channel.

---

**LinkedInScholar** - Empowering students to build successful careers through AI-powered guidance 🚀