import axios from "axios"
import getConfig from "next/config";
import authHeader from "./auth-header";
const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.API_ENDPOINT;

class User {
  users() {
    return axios
      .get(API_URL + "users/", { headers: authHeader() })
      .then(response => {
        localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
        return response.data;
      },
      error => {
        return error;
      }
    );
  }

  addUser(userInfo) {
    return axios
      .post(API_URL + "users/add", userInfo, { headers: authHeader() })
      .then(
        response => {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
          return response.data;
        },
        error => {
          return error;
        }
      )
  }

  deleteUser(id) {
    return axios
      .get(API_URL + "users/delete/" + id, { headers: authHeader() })
      .then(
        response => {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
          return response.data;
        },
        error => {
          return error;
        }
      )
  }

  editUser(userInfo, id) {
    return axios
      .post(API_URL + "users/edit/" + id, userInfo, { headers: authHeader() })
      .then(
        response => {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
          return response.data;
        },
        error => {
          return error;
        }
      )
  }
}

export default new User();