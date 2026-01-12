import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://medicine-image-analyzer-backend.onrender.com";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 120000, // 2 minutes for Render cold starts
      withCredentials: false, // Don't send credentials for CORS
    });
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    return this.api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async searchMedicine(medicineName) {
    return this.api.get(`/search/${encodeURIComponent(medicineName)}`);
  }

  async getMedicineInfo(medicineName) {
    return this.api.get(`/medicine/${encodeURIComponent(medicineName)}`);
  }

  async getPrice(medicineName) {
    return this.api.get(`/price/${encodeURIComponent(medicineName)}`);
  }

  async healthCheck() {
    return this.api.get('/health');
  }
}

export default new ApiService();