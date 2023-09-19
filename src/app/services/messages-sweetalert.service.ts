import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessagesSweetalertService {

  constructor(private router: Router) { }

  successMsg(msg:string, msg2?:string) {
    Swal.fire(
      msg,
      msg2,
      'success',
    )
  }

  errorMsg(title?:string, msg?:string, link?:string, textLink?:string,
           allowOutsideClick:boolean = true, allowEscapeKey: boolean = true, allowEnterKey: boolean = true,
           confirmButtonText:string = 'OK') {
    Swal.fire({
      icon: 'error',
      title: title + '!',
      text: msg,
      footer: textLink ? '<a href="' + link + '">' + textLink + '</a>' : '',
      allowOutsideClick: allowOutsideClick,
      allowEscapeKey: allowEscapeKey,
      allowEnterKey: allowEnterKey,
      confirmButtonText: confirmButtonText,
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
        let msg401_1 = "Sessão expirada!!"
        let msg401_2 = msg ? msg : "Sessão do usuário expirada!, code: 401"
        this.errorMsg(msg401_1, msg401_2, '', '', false, false, true)
        localStorage.removeItem(environment.storage_token);
        localStorage.removeItem(environment.storage_user);
        this.router.navigate(['login']);
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
