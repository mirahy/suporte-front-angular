import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { HomeService } from '../../../services/home.service';
import { AbstractComponent } from '../../../shared/components/abstract-component';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent extends AbstractComponent implements OnInit {
  constructor(
    private HomeService: HomeService,
    private usuarioService: UsuarioService
  ) {
    super();
  }

  permissao = '';
  nomeSobrenome = "";

  clickToogleNav() {
    this.HomeService.clickToogleNav();
  }

  ngOnInit(): void {
    this.usuarioService
      .usuarioLogado()
      .then((response) => {
        const nomeCompleto = response.name
        const nome = nomeCompleto.split(" ")[0]
        const sobreNome = nomeCompleto.split(" ")[(nomeCompleto.split(" ").length)-1]
        this.nomeSobrenome = nome +" "+sobreNome
        this.permissao = response.permissao;
      })
      .catch((response) => {
        this.status = this.ERROR;
        console.log(response);
      });
  }
}
