import axios from 'axios';
import Constants from '../util/Constants';

const API_URL = Constants.BASE_URL+'/api/test/';

class AdminService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }
}

export default new AdminService();