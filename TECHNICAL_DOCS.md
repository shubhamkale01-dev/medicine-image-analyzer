# Medicine Information Web Application - Technical Documentation

## Project Overview

A professional web application that analyzes medicine strips/tablets using OCR technology and provides comprehensive medicine information using free public APIs.

## Architecture

### Frontend (React.js)
- **Components**: Modular React components for UI
- **Services**: API communication layer
- **Styling**: Custom CSS with responsive design
- **Features**: Drag-and-drop upload, image preview, loading states

### Backend (Node.js + Express)
- **Server**: Express.js REST API
- **OCR**: Tesseract.js for text extraction
- **APIs**: OpenFDA and RxNorm integration
- **File Handling**: Multer for image uploads

## Key Features

### 1. Image Upload & Processing
- Drag-and-drop interface
- File validation (JPG/PNG, 5MB limit)
- Image preprocessing for better OCR accuracy
- Real-time preview

### 2. OCR Text Extraction
- Tesseract.js integration
- Image preprocessing (resize, greyscale, sharpen)
- Medicine name detection algorithms
- Text cleaning and normalization

### 3. Medicine Information Retrieval
- **OpenFDA API**: Official FDA drug information
  - Brand and generic names
  - Indications and usage
  - Warnings and precautions
  - Side effects
  - Dosage information

- **RxNorm API**: Standardized medicine data
  - RxCUI identifiers
  - Active ingredients
  - Standard nomenclature

### 4. Price Information
- Mock pricing data for reference
- Approximate price ranges
- Clear disclaimers about accuracy

### 5. Safety & Compliance
- Medical disclaimers
- Educational purpose statements
- Professional UI design
- Error handling and validation

## API Endpoints

### POST /api/upload
Uploads and processes medicine image
- **Input**: Multipart form data with image file
- **Output**: OCR results, medicine info, and pricing
- **Processing**: OCR → Name detection → API calls → Response

### GET /api/medicine/:name
Retrieves medicine information
- **Input**: Medicine name parameter
- **Output**: FDA and RxNorm data

### GET /api/price/:name
Gets approximate pricing
- **Input**: Medicine name parameter
- **Output**: Price range and disclaimers

### GET /api/health
Health check endpoint
- **Output**: API status

## Technology Stack

### Core Technologies
- **Frontend**: React 18, React Hooks
- **Backend**: Node.js, Express.js
- **OCR**: Tesseract.js (open-source)
- **Image Processing**: Sharp.js

### Dependencies
- **Frontend**: axios, react-dropzone
- **Backend**: multer, cors, dotenv
- **APIs**: OpenFDA, RxNorm (free public APIs)

## File Structure

```
medicine-app/
├── backend/
│   ├── services/
│   │   ├── ocrService.js      # OCR processing
│   │   ├── medicineService.js # API integration
│   │   └── priceService.js    # Pricing logic
│   ├── uploads/               # Image storage
│   ├── server.js             # Main server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── App.js           # Main app
│   │   ├── App.css          # Styles
│   │   └── index.js         # Entry point
│   ├── public/
│   └── package.json
├── README.md
└── setup.bat
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Quick Setup
1. Run `setup.bat` (Windows) or install manually
2. Start backend: `cd backend && npm start`
3. Start frontend: `cd frontend && npm start`
4. Open http://localhost:3000

### Manual Setup
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## Configuration

### Environment Variables (.env)
```
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpeg,jpg,png
FRONTEND_URL=http://localhost:3000
```

## API Integration Details

### OpenFDA API
- **Endpoint**: https://api.fda.gov/drug/label.json
- **Rate Limit**: 240 requests per minute
- **Authentication**: None required
- **Data**: Official FDA drug labels

### RxNorm API
- **Endpoint**: https://rxnav.nlm.nih.gov/REST
- **Rate Limit**: No official limit
- **Authentication**: None required
- **Data**: Standardized drug nomenclature

## Error Handling

### Frontend
- File validation errors
- Network request failures
- OCR processing errors
- User-friendly error messages

### Backend
- File upload validation
- OCR processing failures
- API timeout handling
- Graceful degradation

## Security Considerations

### File Upload Security
- File type validation
- File size limits
- Temporary file cleanup
- Path traversal prevention

### API Security
- CORS configuration
- Request timeout limits
- Input sanitization
- Error message sanitization

## Performance Optimizations

### OCR Processing
- Image preprocessing for accuracy
- Optimal image sizing
- Efficient text extraction
- Result caching potential

### API Calls
- Parallel API requests
- Timeout handling
- Fallback mechanisms
- Response caching

## Future Enhancements

### Technical Improvements
- Database integration for caching
- User authentication system
- Advanced OCR models
- Real-time price APIs

### Feature Additions
- Medicine interaction checker
- Dosage calculator
- Prescription management
- Multi-language support

## Deployment Considerations

### Production Setup
- Environment configuration
- Process management (PM2)
- Reverse proxy (Nginx)
- SSL certificate setup

### Scaling Options
- Load balancing
- Database clustering
- CDN for static assets
- Microservices architecture

## Compliance & Legal

### Medical Disclaimers
- Educational purpose only
- No medical advice provided
- Professional consultation required
- Liability limitations

### Data Privacy
- No personal data storage
- Temporary file handling
- GDPR compliance ready
- Privacy policy requirements

## Testing Strategy

### Unit Testing
- Component testing (React)
- Service function testing
- API endpoint testing
- OCR accuracy testing

### Integration Testing
- End-to-end workflows
- API integration testing
- File upload testing
- Error scenario testing

## Monitoring & Logging

### Application Monitoring
- API response times
- OCR processing duration
- Error rate tracking
- User interaction analytics

### Logging Strategy
- Request/response logging
- Error logging
- Performance metrics
- Security event logging

This documentation provides a comprehensive overview of the Medicine Information Web Application, covering all technical aspects, setup procedures, and considerations for production deployment.