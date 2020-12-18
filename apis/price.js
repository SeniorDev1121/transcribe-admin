import axios from "axios"
import getConfig from "next/config";
import authHeader from "./auth-header";
const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.API_ENDPOINT;

class Price {
  price() {
    return axios
      .get(API_URL + "price/", { headers: authHeader() })
      .then(response => {
        localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
        return response.data;
      },
      error => {
        return error;
      }
    );
  }

  editPrice(priceValue) {
    return axios
      .post(API_URL + "price/edit", priceValue, { headers: authHeader() })
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
  
  dashboard() {
    return axios
      .get(API_URL + "price/dashboard", { headers: authHeader() })
      .then(response => {
        localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
        return response.data;
      },
        error => {
          return error;
        }
      );
  }
}

export default new Price();