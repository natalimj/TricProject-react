import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://tricproject.azurewebsites.net/api/test/';

class AdminService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new AdminService();