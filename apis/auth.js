import axios from "axios"
import authHeader from './auth-header';
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.API_ENDPOINT;

class Auth {
  signin(authInfo) {
    return axios
      .post(API_URL + "auth/login", authInfo)
      .then(response => {
        if (response.data.jwt_token !== null) {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
        }
        return response.data;
      });
  }

  signout() {
    localStorage.clear();
    return true;
  }

  signup(authInfo) {
    return axios
      .post(API_URL + "auth/register", authInfo)
      .then(response => {
        if (response.data.jwt_token !== null) {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
        }
        return response.data;
      });
  }


}

export default new Auth();