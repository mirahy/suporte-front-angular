import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { HomeService } from '../../../services/home.service';
import { AbstractComponent } from '../../../shared/components/abstract-component';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent extends AbstractComponent implements OnInit {
  permissao:string = '';
  keepuser:boolean = false;
  nomeSobrenome :any;
  mostrarNavbar: boolean = false;

  constructor(
    private HomeService: HomeService,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {
    super();
  }



  clickToogleNav() {
    this.HomeService.clickToogleNav();
  }

  deslogar(){
    this.usuarioService.logout()
  }


  ngOnInit(): void { 
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Verifique se existe usuário logado
        this.mostrarNavbar = this.usuarioService.logado
        this.permissao = this.usuarioService.permissao
        this.keepuser = this.usuarioService.keepUser;
        this.nomeSobrenome = this.usuarioService.firstLastNameUser 
      }
    });
     
  }
}
