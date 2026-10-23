# PartSight AI - Industrial Part Inspection Platform

## Overview

PartSight AI is a full-stack web application for AI-powered industrial component inspection, defect detection, predictive maintenance, and damage prevention. The platform helps industrial operators, maintenance engineers, and quality inspection teams manage machines, track components, and detect defects through computer vision analysis.

## Project Structure

```
partsight-ai/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── api/             # API client and endpoints
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── index.html
├── backend/                  # FastAPI + Python
│   ├── routers/             # API route handlers
│   ├── main.py              # FastAPI application
│   ├── database.py          # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication logic
│   └── requirements.txt
├── docs/                     # Documentation
└── README.md
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **Pydantic** - Data validation
- **Python-Jose** - JWT authentication
- **Passlib** - Password hashing
- **OpenCV** - Image processing
- **Pillow** - Image handling

### Database
- **SQLite** - Local development (easily switchable to PostgreSQL)

### Testing & Quality
- **Pytest** - Backend testing
- **TypeScript** - Frontend type checking
- **ESLint** - Code linting

## Features

### Authentication & Authorization
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes and API endpoints
- ✅ Role-based access (admin/operator)
- ✅ Session management

### Machine Management
- ✅ Create, read, update, delete machines
- ✅ Machine status tracking (operational, maintenance, inactive)
- ✅ Location and type tracking
- ✅ Search and filter capabilities

### Component Management
- ✅ Manage industrial parts/components
- ✅ Link components to machines
- ✅ Track serial numbers and conditions
- ✅ Full CRUD operations

### AI-Powered Inspection
- ✅ Image upload with validation
- ✅ Computer vision-based defect detection
- ✅ Defect categorization (scratches, cracks, corrosion, wear, deformation)
- ✅ Confidence scoring
- ✅ Severity classification (low, medium, high, critical)
- ✅ Automated recommendations

### Inspection History
- ✅ Search and filter past inspections
- ✅ View detailed inspection results
- ✅ Image storage and retrieval
- ✅ Defect tracking over time

### Alerts & Maintenance
- ✅ Automatic alert generation from defects
- ✅ Alert acknowledgment and resolution
- ✅ Maintenance task creation and tracking
- ✅ Priority and due date management
- ✅ Status tracking (pending, completed, etc.)

### Analytics & Dashboard
- ✅ Real-time machine statistics
- ✅ Inspection timeline charts
- ✅ Defect distribution analysis
- ✅ Severity trends
- ✅ Machine health overview
- ✅ Active alerts display

### User Interface
- ✅ Professional dark-themed dashboard
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Loading states and error handling
- ✅ Empty state handling
- ✅ Intuitive navigation
- ✅ Real-time data updates

## Installation & Setup

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.9+ (backend)
- pip (Python package manager)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Initialize database:**
   ```bash
   python -c "from database import init_db; init_db()"
   ```

6. **Run backend server:**
   ```bash
   python main.py
   ```
   Server runs on http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local if needed (default: http://localhost:8000/api/v1)
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   App runs on http://localhost:5173

## API Documentation

### Base URL
`http://localhost:8000/api/v1`

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout

### Machine Endpoints
- `GET /machines` - List all machines
- `GET /machines/{id}` - Get machine details
- `POST /machines` - Create new machine
- `PUT /machines/{id}` - Update machine
- `DELETE /machines/{id}` - Delete machine

### Component Endpoints
- `GET /components` - List all components
- `GET /components/{id}` - Get component details
- `POST /components` - Create new component
- `PUT /components/{id}` - Update component
- `DELETE /components/{id}` - Delete component

### Inspection Endpoints
- `GET /inspections` - List inspections
- `GET /inspections/{id}` - Get inspection details
- `POST /inspections` - Create inspection (file upload)

### Alert Endpoints
- `GET /alerts` - List alerts
- `GET /alerts/{id}` - Get alert details
- `POST /alerts/{id}/acknowledge` - Acknowledge alert
- `POST /alerts/{id}/resolve` - Resolve alert

### Maintenance Endpoints
- `GET /maintenance` - List maintenance tasks
- `GET /maintenance/{id}` - Get task details
- `POST /maintenance` - Create maintenance task
- `PUT /maintenance/{id}` - Update task
- `POST /maintenance/{id}/complete` - Mark as complete

### Dashboard Endpoints
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/chart-data` - Get chart data for analytics

### Health Check
- `GET /health` - API health status

## Running Tests

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Type Checking
```bash
cd frontend
npm run type-check
```

### Frontend Linting
```bash
cd frontend
npm run lint
```

## Production Deployment

### Environment Configuration

1. **Backend (.env):**
   ```
   DATABASE_URL=postgresql://user:password@host/dbname
   SECRET_KEY=your-long-random-secret-key
   CORS_ORIGINS=https://yourdomain.com
   PORT=8000
   ```

2. **Frontend (.env.production):**
   ```
   VITE_API_URL=https://api.yourdomain.com/api/v1
   ```

### Backend Deployment Options
- Heroku
- Railway
- Render
- AWS Elastic Beanstalk
- DigitalOcean App Platform
- Custom VPS

### Frontend Deployment
- GitHub Pages (with `/partvisit` base path)
- Vercel
- Netlify
- AWS S3 + CloudFront
- Custom web server

## Database Models

### User
- id, email, name, hashed_password, role, created_at

### Machine
- id, user_id, name, type, location, status, created_at

### Component
- id, user_id, machine_id, name, type, serial_number, condition, created_at

### Inspection
- id, user_id, machine_id, component_id, image_path, status, severity, defects, recommendation, created_at

### Alert
- id, user_id, machine_id, component_id, title, description, priority, status, created_at, acknowledged_at, resolved_at

### Maintenance
- id, user_id, machine_id, component_id, title, description, priority, due_date, status, created_at, completed_at

## Authentication Flow

1. User registers with email and password
2. Backend hashes password and stores user
3. User logs in with credentials
4. Backend verifies password and generates JWT token
5. Frontend stores token in localStorage
6. Token sent in Authorization header for protected requests
7. Backend validates token on each request
8. User can logout to clear token

## Defect Detection

The inspection service uses OpenCV-based heuristic analysis:
- Edge detection for surface irregularities
- Contour analysis for defect identification
- Variance testing for wear patterns
- Confidence scoring (0-1 range)
- Automated severity classification

**Note:** This is a prototype implementation. A production system would use a trained deep learning model (CNN, YOLO, etc.) for more accurate defect detection.

## File Upload

- Maximum file size: 10MB
- Supported formats: JPEG, PNG
- Files stored in `backend/uploads/` directory
- Timestamped filenames for uniqueness

## Security Considerations

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration (30 days)
- ✅ CORS configured for specific origins
- ✅ Environment variables for secrets
- ✅ SQL injection protection via SQLAlchemy ORM
- ✅ Server-side authorization checks
- ✅ HTTPS recommended for production

## Performance Optimization

- Database indexing on frequently queried fields
- Pagination for large lists (10 items default)
- Image compression during upload
- Lazy loading of components
- Code splitting in Vite build

## Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
# Clear __pycache__
find . -type d -name __pycache__ -exec rm -r {} +
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

### Frontend won't connect to backend
- Verify backend is running on http://localhost:8000
- Check CORS_ORIGINS environment variable
- Check browser console for network errors
- Verify VITE_API_URL is correct

### Database issues
```bash
# Reset database (deletes all data)
rm partsight.db
python -c "from database import init_db; init_db()"
```

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests
4. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue or contact the development team.

---

**Last Updated:** October 23, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
