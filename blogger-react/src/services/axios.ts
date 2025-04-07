import axios from "axios";
import { API_URL, jsonHeaders } from "./ServiceCommon";

export const authApiAxios = axios.create({
  baseURL: API_URL,
  headers: jsonHeaders,
  adapter: "fetch", // tests are mocking the fetch api, so use fetch instead of the default xhr
});
