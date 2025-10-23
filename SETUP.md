# 🚀 Setup Guide for AstroUser

## Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/astrouser?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: JWT Secret for future authentication
JWT_SECRET=your_jwt_secret_here

# Optional: CORS Origins
CORS_ORIGIN=http://localhost:3000
```

## Quick Start Commands

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Test API
```bash
cd backend
npm run test:api
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<cluster>` in the MONGO_URI
5. Create a database named `astrouser`
6. Create a collection named `astrologers`

## Adding Your Astrologer Data

### Sample Document Structure
```json
{
  "name": "Pandit Rohit Sharma",
  "expertise": "Vedic Astrology",
  "category": "Vedic Astrology",
  "gender": "Male",
  "experience": 15,
  "languages": ["Hindi", "English"],
  "rating": 4.9,
  "reviews": 1200,
  "pricePerMin": 5,
  "verified": true,
  "image": "/login.jpg",
  "description": "Expert in Vedic astrology with 15+ years of experience...",
  "availability": {
    "chat": true,
    "call": true,
    "video": true
  },
  "online": true,
  "specialties": ["Kundli Analysis", "Marriage Compatibility", "Career Guidance"]
}
```

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] API endpoints respond correctly
- [ ] Astrologer data displays on frontend
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Individual astrologer pages load
- [ ] Responsive design works on mobile

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string
   - Ensure IP whitelist includes 0.0.0.0/0 for development
   - Verify database and collection names

2. **CORS Errors**
   - Backend CORS is configured for localhost:3000
   - Check if frontend is running on correct port

3. **API Not Responding**
   - Verify backend is running on port 5000
   - Check console for error messages
   - Run `npm run test:api` to test endpoints

4. **Frontend Not Loading Data**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Ensure astrologer data exists in MongoDB

## Production Deployment

### Backend
- Deploy to Heroku, Railway, or DigitalOcean
- Set environment variables in deployment platform
- Update CORS origins for production domain

### Frontend
- Deploy to Vercel, Netlify, or similar
- Update API URLs to production backend
- Build and test before deployment

## Support

If you encounter issues:
1. Check the console logs
2. Verify all environment variables
3. Test API endpoints individually
4. Ensure MongoDB Atlas is accessible

