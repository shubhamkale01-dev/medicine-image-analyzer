const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const ocrService = require('./services/ocrService');
const medicineService = require('./services/medicineService');
const priceService = require('./services/priceService');

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Medicine Image Analyzer Backend is running 🚀");
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://medicine-image-analyzer-1.onrender.com', 'https://your-frontend-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('uploads/'));
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + sanitizedName);
  }
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const extractedText = await ocrService.extractText(req.file.path);
    const medicineName = ocrService.cleanMedicineName(extractedText);
    
    if (!medicineName) {
      return res.status(400).json({ error: 'Could not detect medicine name from image' });
    }

    const medicineInfo = await medicineService.getMedicineInfo(medicineName);
    const priceInfo = priceService.getApproximatePrice(medicineName);

    res.json({
      success: true,
      data: {
        extractedText,
        medicineName,
        medicineInfo,
        priceInfo,
        imageUrl: `/uploads/${req.file.filename}`
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to process image' });
  }
});

app.get('/api/search/:query', async (req, res) => {
  try {
    const query = req.params.query.trim();
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
    const medicineInfo = await medicineService.getMedicineInfo(query);
    const priceInfo = priceService.getApproximatePrice(query);
    
    res.json({
      success: true,
      data: {
        medicineName: query,
        medicineInfo,
        priceInfo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/medicine/:name', async (req, res) => {
  try {
    const medicineInfo = await medicineService.getMedicineInfo(req.params.name);
    res.json({ success: true, data: medicineInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/price/:name', (req, res) => {
  try {
    const priceInfo = priceService.getApproximatePrice(req.params.name);
    res.json({ success: true, data: priceInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/test/:name', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working',
    name: req.params.name,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medicine Info API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});