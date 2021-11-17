import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://r003-apiblog.herokuapp.com/api/",
});