import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TempWebRequestsService {

  constructor() { }

  token = localStorage.getItem(environment.storage_token)
    ? JSON.parse(atob(localStorage.getItem(environment.storage_token)!))
    : null;
  headers = {
    Authorization: 'Bearer ' + this.token,
    Accept: 'application/json',
  };

  get(param: string, token?:string) {
    let headers = {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      };
    return axios.get(environment.web_url + param, {
      headers: token ? headers : this.headers,
    });
  }

  post(param: string, data: any, token?:string) {
    let headers = {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    };
    return axios.post(environment.web_url + param, data, {
      headers: token ? headers : this.headers,
    });
  }

  put(param: string, data: any, token?:string) {
    let headers = {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    };
    return axios.put(environment.web_url + param, data, {
      headers: token ? headers : this.headers,
    });
  }

  delete(param: string, token?:string){
    let headers = {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    };
    return axios.delete(environment.web_url + param, {
      headers: token ? headers : this.headers,
    });
  }

  
  getUrl(url: string) {
    return axios.get(environment.web_url + url);
  }
}
