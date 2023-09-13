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

  get(param: string, token?:string) {
    let headers = {
        Authorization: 'Bearer ' + token,
      };
    return axios.get(environment.api_url + param, {
      headers: token ? headers : this.headers,
    });
  }

  post(param: string, data: any, token?:string) {
    let headers = {
      Authorization: 'Bearer ' + token,
    };
    return axios.post(environment.api_url + param, data, {
      headers: token ? headers : this.headers,
    });
  }

  put(param: string, data: any, token?:string) {
    let headers = {
      Authorization: 'Bearer ' + token,
    };
    return axios.put(environment.api_url + param, data, {
      headers: token ? headers : this.headers,
    });
  }

  delete(param: string, token?:string){
    let headers = {
      Authorization: 'Bearer ' + token,
    };
    return axios.delete(environment.api_url + param, {
      headers: token ? headers : this.headers,
    });
  }

  
  getUrl(url: string) {
    return axios.get(environment.web_url + url);
  }
}
