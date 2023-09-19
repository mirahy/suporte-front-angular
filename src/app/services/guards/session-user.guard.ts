import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { environment } from 'src/environments/environment';
import { inject } from '@angular/core';
import { MessagesSweetalertService } from '../messages-sweetalert.service';
import { Usuario } from 'src/app/components/pages/usuarios/usuario';

export const sessionUserGuard: CanActivateFn = (route, state) => {
  
  const usuarioService: UsuarioService = inject(UsuarioService)
  const router: Router = inject(Router)
  const msg: MessagesSweetalertService = inject(MessagesSweetalertService)
  if(usuarioService.logado){
    console.log(usuarioService.logado)
    console.log(usuarioService.usuarioLogado())
      if(usuarioService.usuarioLogado() instanceof Usuario){
        return true;
      }
      localStorage.removeItem(environment.storage_token);
      localStorage.removeItem(environment.storage_user);
      router.navigate(['login']); 
      return false;
  }
  return true;
};
