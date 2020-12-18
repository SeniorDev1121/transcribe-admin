import axios from "axios";
import getConfig from "next/config";
import authHeader from "./auth-header";
const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.API_ENDPOINT;

var progressArray = [];
var totalArray = [];
var loadedArray = [];
var speedArray = [];
var isInitialLoading = true;

class UploadMedia {
  upload(fileUploadInfo, callback, index, startTime, initialProgress, initialTotal, initialLoaded, initialSpeed) {
    return axios
      .post(API_URL + "medias/upload", fileUploadInfo, {
        onUploadProgress: function processcallback(progressEvent) {
          var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          var currentTime = new Date();
          var speed = progressEvent.loaded / 1024 / 1024 / (currentTime - startTime) * 1000;
          if (isInitialLoading) {
            callback(index, initialProgress, initialTotal, initialLoaded, initialSpeed);
            progressArray = initialProgress;
            totalArray = initialTotal;
            loadedArray = initialLoaded;
            speedArray = initialSpeed;
            isInitialLoading = false;
          } else {
            progressArray[index] = percentCompleted;
            totalArray[index] = progressEvent.total / 1024 / 1024;
            loadedArray[index] = progressEvent.loaded / 1024 / 1024;
            speedArray[index] = speed;
            callback(index, progressArray, totalArray, loadedArray, speedArray);
          }
        }, headers: authHeader() })
      .then(
        response => {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
          return response.data;
        },
        error => {
          var json = '{"msg":"failure", "index": ' + index + ', "error":' + error + '}'
          return JSON.parse(json);
        }
      )
  }
}

export default new UploadMedia();