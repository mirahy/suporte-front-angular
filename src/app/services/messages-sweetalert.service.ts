import { Injectable } from '@angular/core';
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessagesSweetalertService {

  constructor() { }

  successMsg(msg:string, msg2?:string) {
    Swal.fire(
      msg,
      msg2,
      'success'
    )
  }

  errorMsg(title?:string, msg?:string, link?:string, textLink?:string) {
    Swal.fire({
      icon: 'error',
      title: title + '!',
      text: msg,
      footer: '<a href="' + link + '">' + textLink + '</a>'
    })
  }

  msgHttp(response:any){
    switch (response.status) {
      case 200:
        let msg200_1 = response.data ? response.data.msg : " "
        let msg200_2 = ""
        this.successMsg(msg200_1, msg200_2)
        break;

      case 401:
        let msg401_1 = "Sem Acesso!"
        let msg401_2 = "Usuário não autorizado!"
        this.errorMsg(msg401_1, msg401_2, 'login', 'Login')
        break;
    
      default:
        this.errorMsg(response.message, 'login', 'Login')
        break;
    }
  }

}
