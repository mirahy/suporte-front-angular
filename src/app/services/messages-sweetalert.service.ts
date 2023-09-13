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

  msgHttp(response:any, msg?:string){
    switch (response.status) {
      case 200:
        let msg200_1 = 'Tudo ok!'
        let msg200_2 = msg ? msg : response.data ? response.data.msg : " "
        this.successMsg(msg200_1, msg200_2)
        break;

      case 400:
        let msg400_1 = "Erro de execução!!"
        let msg400_2 = msg ? msg : "Erro no processamento dos dados!, code: 400"
        this.errorMsg(msg400_1, msg400_2, 'home', 'Home')
        break;

      case 401:
        let msg401_1 = "Sem Acesso!!"
        let msg401_2 = msg ? msg : "Usuário não autorizado!, code: 401"
        this.errorMsg(msg401_1, msg401_2, 'login', 'Login')
        break;

      case 404:
        let msg404_1 = "!!!"
        let msg404_2 = msg ? msg : "Página não encontada!, code: 404"
        this.errorMsg(msg404_1, msg404_2, 'home', 'Home')
        break;
    
      default:
        this.errorMsg(msg ? msg : response.message, 'login', 'Login')
        break;
    }
  }

}
