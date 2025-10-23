# 🔮 AstroUser - Professional Astrology Web Application

A full-stack astrology consultation platform built with Next.js and Node.js, featuring a modern orange-yellow themed UI with comprehensive astrologer management and search functionality.

## ✨ Features

### Frontend (Next.js + Tailwind CSS)
- **Orange-Yellow Themed UI** with gradient effects and smooth animations
- **Responsive Design** that works on all devices
- **Top Astrologers Section** on home page with dynamic data fetching
- **Comprehensive Astrologer Listing** with advanced search and filtering
- **Detailed Astrologer Profiles** with full information and action buttons
- **Search & Filter Functionality** by name, category, gender, language, and expertise
- **Real-time Status Indicators** for online/offline astrologers
- **Loading States** and error handling throughout the application

### Backend (Node.js + Express + MongoDB)
- **RESTful API** with comprehensive CRUD operations
- **Advanced Search & Filtering** with multiple criteria support
- **MongoDB Atlas Integration** for scalable data storage
- **Security Middleware** including helmet, CORS, and XSS protection
- **Error Handling** with proper HTTP status codes
- **Data Validation** and sanitization

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will be running on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:3000`

## 📊 Database Schema

### Astrologer Model
```javascript
{
  name: String (required),
  expertise: String (required),
  category: String (required),
  gender: String (enum: ["Male", "Female"]),
  experience: Number (required),
  languages: [String],
  rating: Number (default: 0),
  reviews: Number (default: 0),
  pricePerMin: Number (required),
  verified: Boolean (default: true),
  image: String (required),
  description: String,
  availability: {
    chat: Boolean (default: true),
    call: Boolean (default: true),
    video: Boolean (default: false)
  },
  online: Boolean (default: false),
  specialties: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Astrologers
- `GET /api/v1/astrologers` - Get all astrologers with search/filter support
- `GET /api/v1/astrologers/top` - Get top-rated astrologers
- `GET /api/v1/astrologers/:id` - Get single astrologer by ID
- `POST /api/v1/astrologers` - Create new astrologer (admin)
- `PUT /api/v1/astrologers/:id` - Update astrologer (admin)
- `DELETE /api/v1/astrologers/:id` - Delete astrologer (admin)

### Query Parameters for GET /api/v1/astrologers
- `search` - Search by name, expertise, or description
- `category` - Filter by category
- `gender` - Filter by gender
- `language` - Filter by language
- `expertise` - Filter by expertise
- `sortBy` - Sort by field (rating, pricePerMin, experience, reviews)
- `sortOrder` - Sort order (asc, desc)

## 🎨 UI Components

### Key Components
- **AstrologersCarousel** - Home page astrologer showcase
- **AstrologerCard** - Individual astrologer display
- **SearchAndFilter** - Advanced filtering interface
- **AstrologerProfile** - Detailed astrologer view

### Styling Features
- **Orange-Yellow Gradient Theme** throughout the application
- **Star Field Background** with animated sparkle effects
- **Glowing Borders** for online astrologers
- **Smooth Hover Animations** and transitions
- **Responsive Grid Layouts** for all screen sizes
- **Loading States** with custom spinners

## 🧪 Testing the Integration

### 1. Backend API Testing
```bash
# Test astrologers endpoint
curl http://localhost:5000/api/v1/astrologers

# Test top astrologers
curl http://localhost:5000/api/v1/astrologers/top

# Test search functionality
curl "http://localhost:5000/api/v1/astrologers?search=vedic&category=Vedic%20Astrology"
```

### 2. Frontend Testing
1. **Home Page**: Visit `http://localhost:3000` and verify the Top Astrologers section loads
2. **Astrologers Page**: Visit `http://localhost:3000/astrologers` and test search/filter functionality
3. **Detail Page**: Click on any astrologer's "View Profile" button to test dynamic routing
4. **Responsive Design**: Test on different screen sizes and devices

### 3. Data Flow Testing
1. **Add astrologer data** to your MongoDB Atlas collection
2. **Verify data appears** on the frontend
3. **Test search functionality** with your data
4. **Test filtering** by different criteria
5. **Test individual astrologer pages**

## 📝 Adding Your Own Astrologer Data

### Method 1: Direct MongoDB Atlas
1. Connect to your MongoDB Atlas cluster
2. Navigate to your database and `astrologers` collection
3. Insert documents following the schema above

### Method 2: Using the API
```bash
curl -X POST http://localhost:5000/api/v1/astrologers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Astrologer Name",
    "expertise": "Vedic Astrology",
    "category": "Vedic Astrology",
    "gender": "Male",
    "experience": 10,
    "languages": ["Hindi", "English"],
    "rating": 4.8,
    "reviews": 500,
    "pricePerMin": 5,
    "image": "/path/to/image.jpg",
    "description": "Detailed description...",
    "availability": {
      "chat": true,
      "call": true,
      "video": false
    },
    "online": true,
    "specialties": ["Kundli Analysis", "Career Guidance"]
  }'
```

## 🔧 Customization

### Adding New Filter Options
1. Update the filter arrays in `frontend/app/astrologers/page.js`
2. Add corresponding backend logic in `backend/controllers/astrologerController.js`

### Styling Modifications
1. Update `frontend/app/globals.css` for global styles
2. Modify component-specific styles in individual files
3. Adjust the orange-yellow theme colors as needed

### Adding New Fields
1. Update the Mongoose schema in `backend/models/astrologerModel.js`
2. Update the frontend components to display new fields
3. Update the API endpoints to handle new fields

## 🚀 Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set environment variables in your deployment platform
3. Ensure MongoDB Atlas allows connections from your deployment IP

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Update API URLs to point to your deployed backend

## 📱 Mobile Responsiveness

The application is fully responsive with:
- **Mobile-first design** approach
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly buttons** and interactions
- **Optimized images** and loading states
- **Readable typography** on all devices

## 🔒 Security Features

- **XSS Protection** with input sanitization
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **Input Validation** on all API endpoints
- **NoSQL Injection Protection**

## 📈 Performance Optimizations

- **Lazy Loading** for images and components
- **Efficient API Queries** with proper indexing
- **Caching Strategies** for frequently accessed data
- **Optimized Bundle Size** with code splitting
- **Smooth Animations** with CSS transforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation above
- Review the component structure
- Test with your own MongoDB Atlas data
- Ensure all environment variables are set correctly

---

**Happy Coding! 🔮✨**

