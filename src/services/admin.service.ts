import axios from 'axios';
import authHeader from './auth-header';
import Constants from '../util/Constants';

const API_URL = Constants.BASE_URL+'/api/test/';

class AdminService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new AdminService();