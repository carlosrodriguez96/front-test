import axios from 'axios';
//const baseURL= 'http://coleccionart.herokuapp.com/api/';
const baseURL= 'http://localhost:8000/api/';
export default axios.create({
    baseURL,
});