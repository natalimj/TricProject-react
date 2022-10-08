import axios from "axios";

const API_URL = "https://tricproject.azurewebsites.net/api/auth/";

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
  return localStorage.getItem("admin");
};

export default new AuthService();