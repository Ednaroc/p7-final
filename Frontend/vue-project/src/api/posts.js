// import axios from 'axios'
// ? Should I try to set up something like that for Axios

// try {
//     const productPromise = makeRequest('GET', api + '/' + productId);
//     const productResponse = await productPromise;

const axios = require('axios');
// axios.defaults.withCredentials = true;

const API_SERVER = 'http://localhost:3333/api/';
const instance = axios.create({
  withCredentials: true,
  baseURL: API_SERVER
})


export default {
  index(params) {
    return instance.get('posts/', {
      params: params
    });
  },

  show(id) {
    return instance.get('posts/'+id);
  },

  create(data) {
    return instance.post('posts/', data);
  },

  update(id, data) {
    return instance.put('posts/'+id, data);
  },

  delete(id) {
    return instance.delete('posts/reactions/'+id);
    // return instance.delete('posts/'+id);
  }

}