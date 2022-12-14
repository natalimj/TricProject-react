import axios from "axios";
import Constants from "./Constants";

/**
 * Initializing Axios for React CRUD HTTP Client
 *
 * @ author Natali Munk-Jakobsen 
 */
export default axios.create({
  baseURL: Constants.BASE_URL,
  headers: {
    "Content-type": "application/json"
  }
});