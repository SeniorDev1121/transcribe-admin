import axios from "axios"
import getConfig from "next/config";
import authHeader from "./auth-header";
const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.API_ENDPOINT;

class Media {
  medias() {
    return axios
      .get(API_URL + "medias/", { headers: authHeader() })
      .then(
        response => {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
          return response.data;
        },
        error => {
          return error;
        }
      );
  }

  getMediaByDate(startDate, endDate) {
    var jsonObj = {start_date : "", end_date: ""}
    jsonObj.start_date = startDate;
    jsonObj.end_date = endDate;
    return axios
      .post(API_URL + "medias/search", jsonObj, { headers: authHeader() })
      .then(
        response => {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
          return response.data;
        },
        error => {
          return error;
        }
      );
  }

  deleteMedia(id) {
    return axios
      .get(API_URL + "medias/delete/" + id, { headers: authHeader() })
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

  getRealMediaURL(id) {
    return axios
      .get(API_URL + "medias/" + id + "/url", { headers: authHeader() })
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

export default new Media();