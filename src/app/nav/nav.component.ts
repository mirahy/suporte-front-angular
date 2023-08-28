import { Component, Injectable, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { HomeService } from '../home.service';
import { AbstractComponent } from '../abstract-component';
import { Usuario } from '../usuarios/usuario';

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

  clickToogle() {
    this.HomeService.clickToogle();
  }

  ngOnInit(): void {
    this.usuarioService
      .usuarioLogado()
      .then((response) => {
        var nomeCompleto = response.name
        var nome = nomeCompleto.split(" ")[0]
        var sobreNome = nomeCompleto.split(" ")[(nomeCompleto.split(" ").length)-1]
        this.nomeSobrenome = nome +" "+sobreNome
        this.permissao = response.permissao;
      })
      .catch((response) => {
        this.status = this.ERROR;
        console.log(response);
      });
  }
}
