import axios from "axios"

export default {
  get(url, params = {}){
    return this.submit('get', url, params)
  },

  post(url, params = {}){
    return this.submit('post', url, params)
  },

  put(url, params = {}){
    return this.submit('put', url, params)
  },

  delete(url, params = {}){
    return this.submit('delete', url, params)
  },

  submit(method, url, params){
    let obj = {
      method: method,
      url: url,
    }
    if (String(method).toLowerCase() === 'get'){
      obj.params = params
    }else {
      obj.data = params
    }
    return axios(obj)
  }
}