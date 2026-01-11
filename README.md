# Medicine Information Web Application

A professional web application that analyzes medicine strips/tablets using OCR and provides comprehensive medicine information using free APIs.
## 🌐 Live Demo

🚀 The application is live and accessible here:  
🔗 https://medicine-image-analyzer-1.onrender.com

## Features

- **Image Upload**: JPG/PNG support with validation and preview
- **OCR Text Extraction**: Tesseract OCR for medicine name detection
- **Medicine Information**: OpenFDA and RxNorm APIs for comprehensive data
- **Price Information**: Mock pricing data for reference
- **Professional UI**: Clean, medical-style interface
- **Safety Compliance**: Educational disclaimers and warnings

## Tech Stack

- **Frontend**: React.js with modern hooks
- **Backend**: Node.js + Express.js
- **OCR**: Tesseract OCR (open-source)
- **APIs**: OpenFDA, RxNorm (free public APIs)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
NODE_ENV=development
```

## API Endpoints

- `POST /api/upload` - Upload and process medicine image
- `GET /api/medicine/:name` - Get medicine information
- `GET /api/price/:name` - Get approximate price

## Disclaimer

**This application is for educational purposes only. Always consult a licensed doctor or pharmacist before taking any medicine.**

## License

MIT License
