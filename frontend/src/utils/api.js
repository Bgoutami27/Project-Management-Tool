import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api', // make sure no trailing slash in .env
});

export default API;
