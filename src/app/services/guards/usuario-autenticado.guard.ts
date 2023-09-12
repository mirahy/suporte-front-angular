import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { inject } from '@angular/core';


export const usuarioAutenticadoGuard: CanActivateFn = (route, state) => {

  const usuarioService: UsuarioService = inject(UsuarioService)
  const router: Router = inject(Router)
  if(usuarioService.logado){
    console.log(usuarioService.obterTokenUsuario)
    return true;
  }
  router.navigate(['login'])
  return false;

};
