import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { HomeService } from '../../../services/home.service';
import { AbstractComponent } from '../../../shared/components/abstract-component';
import { Usuario } from '../../pages/usuarios/usuario';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent extends AbstractComponent implements OnInit {
  constructor(
    private HomeService: HomeService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    super();
  }

  permissao = null;
  nomeSobrenome :any;

  clickToogleNav() {
    this.HomeService.clickToogleNav();
  }

  deslogar(){
    this.usuarioService.logout()
    .then(response => {
      this.router.navigate(['login']);
      this.checkPermissao()
    })
    .catch(response =>{
      this.router.navigate(['login']);
      this.checkPermissao()
    });
    
  }

  checkPermissao(){
            const user = this.usuarioService.logado ? this.usuarioService.obterUsuarioLogado : null
            this.permissao = user ? user.permissao : '';
  }

  ngOnInit(): void {
  
            this.nomeSobrenome = this.usuarioService.firstLastNameUser
            this.checkPermissao()
  }
}
