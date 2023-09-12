import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiRequestsService {
  constructor() {}

  token = localStorage.getItem(environment.storage_token)
    ? JSON.parse(atob(localStorage.getItem(environment.storage_token)!))
    : null;

  headers = {
    Authorization: 'Bearer ' + this.token,
  };

  get(param: string) {
    return axios.get(environment.api_url + param, {
      headers: this.headers,
    });
  }

  post(param: string, data: any) {
    return axios.post(environment.api_url + param, data, {
      headers: this.headers,
    });
  }

  put(param: string, data: any) {
    return axios.put(environment.api_url + param, data, {
      headers: this.headers,
    });
  }

  delete(param: string){
    return axios.delete(environment.api_url + param, {
      headers: this.headers,
    });
  }

  
  getUrl(url: string) {
    return axios.get(environment.web_url + url);
  }
}
