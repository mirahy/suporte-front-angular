import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiRequestsService {
  constructor() {}

  token = localStorage.getItem('token')
  ? JSON.parse(atob(localStorage.getItem('token')!))
  : null;
  
  headers = {
  'Authorization': 'Bearer '+ this.token,
  }

  get(param: string) {
    console.log(this.token)
    return axios.get(environment.api_url + param, {
      headers: this.headers
  });
  }

  post(param: string, data:any) {
    return axios.post(environment.api_url + param, data, {
      headers: this.headers
    });
  }
}
