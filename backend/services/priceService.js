class PriceService {
  constructor() {
    // Mock pricing data for common medicines (for educational purposes only)
    this.mockPrices = {
      'paracetamol': { min: 10, max: 50, currency: 'INR', unit: 'strip' },
      'aspirin': { min: 15, max: 60, currency: 'INR', unit: 'strip' },
      'ibuprofen': { min: 20, max: 80, currency: 'INR', unit: 'strip' },
      'amoxicillin': { min: 50, max: 150, currency: 'INR', unit: 'strip' },
      'omeprazole': { min: 30, max: 120, currency: 'INR', unit: 'strip' },
      'metformin': { min: 25, max: 100, currency: 'INR', unit: 'strip' },
      'atorvastatin': { min: 40, max: 200, currency: 'INR', unit: 'strip' },
      'amlodipine': { min: 35, max: 150, currency: 'INR', unit: 'strip' },
      'losartan': { min: 45, max: 180, currency: 'INR', unit: 'strip' },
      'simvastatin': { min: 30, max: 140, currency: 'INR', unit: 'strip' }
    };
  }

  getApproximatePrice(medicineName) {
    if (!medicineName) {
      return this.getDefaultPrice();
    }

    const normalizedName = medicineName.toLowerCase().trim();
    
    // Check for exact match
    if (this.mockPrices[normalizedName]) {
      return {
        ...this.mockPrices[normalizedName],
        medicineName: medicineName,
        disclaimer: 'Approximate price for reference only. Actual prices may vary by location, brand, and pharmacy.',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(this.mockPrices)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return {
          ...value,
          medicineName: medicineName,
          disclaimer: 'Approximate price for reference only. Actual prices may vary by location, brand, and pharmacy.',
          lastUpdated: new Date().toISOString().split('T')[0],
          note: `Price estimated based on similar medicine: ${key}`
        };
      }
    }

    // Generate estimated price for unknown medicines
    return this.generateEstimatedPrice(medicineName);
  }

  generateEstimatedPrice(medicineName) {
    // Generate a reasonable price range based on medicine name characteristics
    const basePrice = 20;
    const variation = Math.floor(Math.random() * 100) + 10;
    
    return {
      min: basePrice,
      max: basePrice + variation,
      currency: 'INR',
      unit: 'strip',
      medicineName: medicineName,
      disclaimer: 'Estimated price for reference only. Actual prices may vary significantly by location, brand, and pharmacy.',
      lastUpdated: new Date().toISOString().split('T')[0],
      note: 'Price estimated - not found in database'
    };
  }

  getDefaultPrice() {
    return {
      min: 20,
      max: 100,
      currency: 'INR',
      unit: 'strip',
      medicineName: 'Unknown Medicine',
      disclaimer: 'Price information not available. Please check with local pharmacy.',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }

  // Method to add new price data (for future expansion)
  addPriceData(medicineName, priceData) {
    const normalizedName = medicineName.toLowerCase().trim();
    this.mockPrices[normalizedName] = {
      ...priceData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }

  // Get all available medicines with prices
  getAllAvailableMedicines() {
    return Object.keys(this.mockPrices).map(name => ({
      name: name,
      ...this.mockPrices[name]
    }));
  }
}

module.exports = new PriceService();