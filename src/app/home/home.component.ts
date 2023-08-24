import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { UsuarioService } from '../usuario.service';
import { AbstractComponent } from '../abstract-component';

declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends AbstractComponent implements OnInit {
  constructor(private homeservice: HomeService,
              private usuarioService: UsuarioService ) {
    super();
  }
  
  permissao = '';

  clickToogle() {
    this.homeservice.clickToogle();
  }

  ngOnInit(): void {
    this.usuarioService.usuarioLogado()
    .then((response:any) => {
      this.permissao = response.permissao
    })
    .catch((response: any) => {
      this.status = this.ERROR;
      console.log(response)
    });
}


}
