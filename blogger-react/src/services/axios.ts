import axios from "axios";
import { API_URL, jsonHeaders } from "./ServiceCommon";

export const authApiAxios = axios.create({
  baseURL: API_URL,
  headers: jsonHeaders,
});
