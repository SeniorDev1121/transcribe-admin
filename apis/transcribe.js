import axios from "axios";
import getConfig from "next/config";
import authHeader from "./auth-header";
const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.API_ENDPOINT;

class Transcribe {
  transcribe (s3_url, mediaId, file_name, spokenLanguage) {
    var jsonObj = {s3_url : "", lang: ""}
    jsonObj.s3_url = s3_url;
    jsonObj.lang = spokenLanguage;
    jsonObj.index = 0;
    jsonObj.file_name = file_name;
    return axios
      .post(API_URL + "transcribe/" + mediaId, jsonObj, { headers: authHeader() })
      .then(
        response => {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
          return response.data;
        },
        error => {
          var json = '{"msg":"S3 upload failure", "success": "false", "index": 0, "error":' + error + '}';
          return JSON.parse(json);
        }
      )
  };
  
  multitranscribes (s3_url, mediaId, index, spokenLanguage, file_name) {
    var jsonObj = {s3_url : "", lang: ""}
    jsonObj.s3_url = s3_url;
    jsonObj.lang = spokenLanguage;
    jsonObj.index = index;
    jsonObj.file_name = file_name;
    return axios
      .post(API_URL + "transcribe/" + mediaId, jsonObj, { headers: authHeader() })
      .then(
        response => {
          localStorage.setItem("jwt_token", JSON.stringify(response.data.jwt_token));
          return response.data;
        },
        error => {
          var json = '{"msg":"S3 upload failure", "success": "false", "index": ' + index + ', "error":' + error + '}';
          return JSON.parse(json);
        }
      )
  }
}

export default new Transcribe();