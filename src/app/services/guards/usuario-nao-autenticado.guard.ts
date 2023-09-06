import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { inject } from '@angular/core';

export const usuarioNaoAutenticadoGuard: CanActivateFn = (route, state) => {
  
  const usuarioService: UsuarioService = inject(UsuarioService)
  const router: Router = inject(Router)
  if (usuarioService.logado) {
    router.navigate(['home']);
    return false;
  }
  return true;
};
