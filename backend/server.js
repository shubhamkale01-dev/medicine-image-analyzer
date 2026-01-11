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
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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
// Extract medicine name using OCR
const medicineName = await ocrService.extractMedicineName(req.file.path);


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

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medicine Info API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});