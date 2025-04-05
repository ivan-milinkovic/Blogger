export const API_URL =
  import.meta.env.VITE_BLOGGER_API_URL || "http://localhost:5292";

console.log("Using API_URL: ", API_URL);

export const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
