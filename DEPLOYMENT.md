# LinkedInScholar Production Deployment Guide

## 🚀 Production Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- Domain name (for production)
- SSL certificates (for HTTPS)

#### Quick Start
```bash
# Clone the repository
git clone https://github.com/baalaganeshr/linkedin-agent.git
cd linkedin-agent

# Copy environment template
cp .env.example .env

# Configure your environment variables
nano .env

# Start the application
docker-compose up -d

# Check status
docker-compose ps
```

#### Environment Configuration
```bash
# Required Variables
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-32-characters-minimum
MONGODB_URI=mongodb://mongodb:27017/linkedinscholar

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# AI Provider (choose at least one)
GROQ_API_KEY=your-groq-api-key  # Recommended - FREE
OLLAMA_HOST=http://localhost:11434  # Local AI
OPENAI_API_KEY=your-openai-api-key  # Paid
GEMINI_API_KEY=your-gemini-api-key  # Paid

# Error Tracking (Optional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Option 2: Manual Deployment

#### Backend Setup
```bash
cd backend
npm install --production
NODE_ENV=production node server.js
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run build:prod
# Serve dist/ folder with your web server
```

## 🏗️ Infrastructure Requirements

### Minimum System Requirements
- **CPU**: 2 vCPUs
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: 1 Gbps

### Recommended Production Setup
- **CPU**: 4+ vCPUs
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Database**: MongoDB Atlas (managed)
- **CDN**: CloudFlare or AWS CloudFront
- **Load Balancer**: nginx or AWS ALB

## 🔒 Security Checklist

### SSL/TLS Configuration
- [ ] Install SSL certificates
- [ ] Configure HTTPS redirects
- [ ] Enable HSTS headers
- [ ] Set up certificate auto-renewal

### Firewall Rules
- [ ] Allow port 80 (HTTP)
- [ ] Allow port 443 (HTTPS)
- [ ] Allow port 22 (SSH) from specific IPs only
- [ ] Block all other ports

### Environment Security
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Configure CORS for your domain only
- [ ] Set up proper MongoDB authentication
- [ ] Enable database encryption at rest
- [ ] Configure backup strategy

### Monitoring Setup
- [ ] Set up Sentry error tracking
- [ ] Configure log aggregation
- [ ] Set up health check monitoring
- [ ] Configure alerting for downtime

## 📊 Performance Optimization

### Database Optimization
```javascript
// MongoDB indexes for optimal performance
db.users.createIndex({ "linkedinId": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.resumes.createIndex({ "userId": 1, "createdAt": -1 })
db.networkingsuggestions.createIndex({ "userId": 1, "createdAt": -1 })
```

### Caching Strategy
- **API Response Caching**: 5-60 minutes based on endpoint
- **Static Asset Caching**: 1 year with versioning
- **Database Query Caching**: MongoDB in-memory cache
- **CDN Caching**: Edge caching for static content

### Resource Limits
```yaml
# Docker resource limits
resources:
  limits:
    memory: "2Gi"
    cpu: "1000m"
  requests:
    memory: "1Gi"
    cpu: "500m"
```

## 🔍 Health Monitoring

### Health Check Endpoints
- `GET /api/health` - Application health
- `GET /api/health/detailed` - Detailed system status
- `GET /health` - nginx health (load balancer)

### Key Metrics to Monitor
- **Application**: Response time, error rate, throughput
- **Database**: Connection count, query performance, storage
- **System**: CPU usage, memory usage, disk space
- **Business**: User registrations, AI requests, feature usage

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check MongoDB status
docker-compose logs mongodb

# Test connection manually
docker exec -it linkedinscholar-db mongo --eval "db.stats()"
```

#### Application Won't Start
```bash
# Check application logs
docker-compose logs app

# Verify environment variables
docker exec -it linkedinscholar-app env | grep -E "(NODE_ENV|MONGODB_URI|JWT_SECRET)"
```

#### High Memory Usage
- Check for memory leaks in logs
- Monitor user rate limit Map cleanup
- Verify garbage collection is working
- Consider increasing container memory limits

### Performance Issues
- Enable query profiling: `db.setProfilingLevel(2)`
- Check Sentry performance monitoring
- Analyze nginx access logs
- Monitor AI provider response times

## 📈 Scaling Strategy

### Horizontal Scaling
1. **Database**: MongoDB replica set or sharding
2. **Application**: Multiple container instances with load balancer
3. **Caching**: Redis cluster for distributed caching
4. **CDN**: Global content distribution

### Vertical Scaling
1. **CPU**: Increase vCPUs for AI processing
2. **Memory**: More RAM for caching and concurrent users
3. **Storage**: Faster SSD for database performance
4. **Network**: Higher bandwidth for API responses

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          docker-compose pull
          docker-compose up -d --no-deps --build app
```

### Blue-Green Deployment
1. Build new version in "green" environment
2. Run health checks and smoke tests
3. Switch load balancer to "green"
4. Keep "blue" for quick rollback if needed

---

## 🎯 Go-Live Checklist

### Pre-Launch
- [ ] SSL certificates installed and tested
- [ ] DNS configured and propagated
- [ ] Environment variables configured
- [ ] Database backups configured
- [ ] Monitoring and alerting active
- [ ] Load testing completed
- [ ] Security scan completed

### Launch Day
- [ ] Deploy to production
- [ ] Verify all services are healthy
- [ ] Test critical user flows
- [ ] Monitor error rates and performance
- [ ] Have rollback plan ready

### Post-Launch
- [ ] Monitor for 24-48 hours
- [ ] Review performance metrics
- [ ] Check error tracking for issues
- [ ] Document any issues and fixes
- [ ] Plan next optimization cycle

**Your LinkedIn Scholar platform is ready for production! 🚀**