const Tesseract = require('tesseract.js');
const sharp = require('sharp');

class OCRService {
  async extractMedicineName(imagePath) {
    try {
      // Preprocess image for better OCR accuracy
      const processedImagePath = await this.preprocessImage(imagePath);
      
      // Extract text using Tesseract
      const { data: { text } } = await Tesseract.recognize(processedImagePath, 'eng', {
  logger: m => console.log(m)
});

// 🔹 OCR ke baad medicine name clean karo
const medicineName = this.cleanMedicineName(text);

// 🔒 SAFETY CHECK — YAHI ADD KARNA HAI
if (!medicineName) {
  throw new Error("Medicine name could not be detected from image");
}

// Final clean medicine name return karo
return medicineName;

    } catch (error) {
      throw new Error(`OCR extraction failed: ${error.message}`);
    }
  }

  async preprocessImage(imagePath) {
    try {
      const processedPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '_processed.png');
      
      await sharp(imagePath)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .greyscale()
        .normalize()
        .sharpen()
        .png()
        .toFile(processedPath);
        
      return processedPath;
    } catch (error) {
      console.warn('Image preprocessing failed, using original:', error.message);
      return imagePath;
    }
  }

  cleanMedicineName(extractedText) {
    if (!extractedText) return null;
    
    // Common medicine name patterns and cleaning
    const lines = extractedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Look for medicine names (usually in caps or title case)
    const medicinePatterns = [
      /^[A-Z][A-Za-z\s]{2,30}$/,  // Title case medicine names
      /^[A-Z\s]{3,30}$/,          // All caps medicine names
      /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g  // Proper nouns
    ];
    
    let candidates = [];
    
    for (const line of lines) {
      for (const pattern of medicinePatterns) {
        const matches = line.match(pattern);
        if (matches) {
          candidates.push(...matches);
        }
      }
    }
    
    // Filter out common non-medicine words
    const excludeWords = ['TABLET', 'CAPSULE', 'MG', 'ML', 'STRIP', 'PACK', 'PHARMA', 'LTD', 'PVT'];
    candidates = candidates.filter(candidate => {
      const upperCandidate = candidate.toUpperCase();
      return !excludeWords.some(word => upperCandidate.includes(word)) && candidate.length >= 3;
    });
    
    // Return the most likely medicine name (first valid candidate)
    return candidates.length > 0 ? candidates[0].trim() : null;
  }
}

module.exports = new OCRService();