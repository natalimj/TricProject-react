import axios from "axios";
import Constants from "../util/Constants";
import jwt_decode, { JwtPayload } from 'jwt-decode';

const API_URL = Constants.BASE_URL + 'api/auth/';

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("admin", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("admin");
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("admin");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export const isAuth = () => {
  const tokenString = localStorage.getItem("admin");
  if (!tokenString) {
    return false;
  }
  const token = JSON.parse(tokenString);
  const decodedToken: JwtPayload = jwt_decode<JwtPayload>(token.accessToken);
  if (!decodedToken.exp) {
    return false;
  }
  const currentDate = new Date();
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    localStorage.removeItem("admin")
    return false;
  }
  return true;
}

export default new AuthService();