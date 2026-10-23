# PartSight AI - Development Setup Guide

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/sanjaykumarskr2025-design/partvisit.git
cd partvisit
```

### 2. Backend Setup (Terminal 1)
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run server
python main.py
```

The backend will be available at: `http://localhost:8000`
API docs available at: `http://localhost:8000/docs`

### 3. Frontend Setup (Terminal 2)
```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env.local

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## Testing the Application

### Test User Credentials
After starting both servers, you can register a new account or use:
- Email: `test@example.com`
- Password: `TestPassword123`

### API Testing
1. Open http://localhost:8000/docs (Swagger UI)
2. Use the "Try it out" button to test endpoints
3. Or use Postman/Insomnia with the exported OpenAPI schema

### Frontend Testing
1. Navigate to http://localhost:5173
2. Register a new account
3. Create a machine
4. Add a component
5. Upload an inspection image
6. View results in dashboard

## Production Build

### Frontend Build
```bash
cd frontend
npm run build
```
Output is in `frontend/dist/`

### Backend Production
```bash
cd backend
# Set environment variables for production
export DATABASE_URL=postgresql://...
export SECRET_KEY=your-strong-secret-key
export CORS_ORIGINS=https://yourdomain.com

# Run with gunicorn for production
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :8000  # For backend
lsof -i :5173  # For frontend

# Kill process
kill -9 <PID>
```

### Database Lock Issues
```bash
rm backend/partsight.db
python -c "from backend.database import init_db; init_db()"
```

### CORS Issues
- Check CORS_ORIGINS in backend .env
- Ensure frontend URL is whitelisted
- Clear browser cache

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Frontend build tested
- [ ] Backend startup verified
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] CORS properly configured
- [ ] File uploads working
- [ ] Dashboard loading data
- [ ] Alerts being generated

## Architecture

```
Frontend (React/Vite)
    ↓ (HTTP/REST)
API Gateway (CORS)
    ↓
FastAPI Backend
    ↓
SQLAlchemy ORM
    ↓
SQLite/PostgreSQL Database
```

## Key Files

- `backend/main.py` - FastAPI application entry point
- `backend/database.py` - Database models
- `backend/routers/` - API endpoints
- `frontend/src/App.tsx` - Frontend app entry
- `frontend/src/pages/` - Page components
- `frontend/src/api/` - API client

## Environment Variables

### Backend
- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - JWT signing key
- `CORS_ORIGINS` - Allowed frontend origins
- `PORT` - Server port

### Frontend
- `VITE_API_URL` - Backend API URL

## Next Steps

1. Read the main `README.md` for complete documentation
2. Review API endpoints in `backend/README.md`
3. Check frontend component structure
4. Review database schema in `backend/database.py`
5. Deploy to your hosting platform

For questions or issues, refer to the troubleshooting section or create an issue on GitHub.
