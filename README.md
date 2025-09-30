# LinkedInScholar 🎓

AI-powered LinkedIn guidance platform designed specifically for college students in India to create professional resumes, optimize their profiles, and build meaningful networks.

## 🆓 NEW: 100% FREE VERSION AVAILABLE!

**Want to use LinkedInScholar with ZERO cost?** 

👉 **[Check out our 100% FREE VERSION](./FREE_README.md)** 👈

- ✅ **MongoDB Atlas FREE** (512MB forever)
- ✅ **Groq AI FREE** (14,400 requests/day, faster than Gemini!)
- ✅ **Render + Vercel FREE** hosting
- ✅ **No premium plans** - everything is free!
- ✅ **No credit card** required

**Total cost: ₹0 | Setup time: 5 minutes**

---

## 🌟 Features

### 🤖 AI-Powered Tools
- **Smart Resume Builder**: Generate ATS-optimized resumes tailored for the Indian job market
- **LinkedIn Profile Optimizer**: Get personalized suggestions to improve your LinkedIn presence  
- **Networking Assistant**: Receive intelligent connection suggestions and message templates
- **Interview Preparation**: AI-generated questions and answers for your target companies

### 💎 Subscription Plans
- **Free Tier**: 3 resumes, 10 networking suggestions, 5 profile optimizations
- **Premium (₹299/month)**: Unlimited access to all features with priority processing

### 🎨 Modern UI/UX
- Dark theme with glassmorphism design
- Responsive layouts for all devices
- Smooth animations with Framer Motion
- Student-friendly interface design

## 🚀 Tech Stack

### Frontend
- **React.js 18** with Vite for fast development
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for client-side navigation
- **Context API** for state management
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication with refresh tokens
- **LinkedIn OAuth 2.0** integration
- **Google Gemini AI** for content generation
- **Comprehensive middleware** (CORS, rate limiting, security)

### Security & Performance
- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **Input validation** with Joi
- **Error handling** with structured responses
- **Usage tracking** for subscription management

## 📁 Project Structure

```
linkedin-scholar/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js              # Authentication & rate limiting
│   ├── models/
│   │   ├── User.js              # User schema with subscription tracking
│   │   ├── Resume.js            # Resume generation history
│   │   └── NetworkingSuggestion.js # Networking interactions
│   ├── routes/
│   │   ├── auth.js              # LinkedIn OAuth & user management
│   │   ├── resume.js            # AI resume generation
│   │   ├── profile.js           # LinkedIn profile optimization
│   │   └── networking.js        # Networking suggestions & messages
│   ├── services/
│   │   └── aiService.js         # Google Gemini AI integration
│   ├── server.js                # Main Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthCallback.jsx      # LinkedIn OAuth callback
│   │   │   ├── LinkedInLogin.jsx     # Glassmorphism login page
│   │   │   └── ProtectedRoute.jsx    # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication state management
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx     # Main dashboard with usage stats
│   │   │   ├── ResumePage.jsx        # AI resume builder
│   │   │   ├── ProfilePage.jsx       # LinkedIn profile optimizer
│   │   │   ├── NetworkingPage.jsx    # Networking assistant
│   │   │   └── UpgradePage.jsx       # Premium subscription
│   │   ├── services/
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