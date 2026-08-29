import API from "../utils/axiosInstance";

export const signupDriver = (data) => API.post("/auth/signup", data);

export const loginDriver = (data) => API.post("/auth/login", data);

export default API;