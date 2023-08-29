import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { UsuarioService } from '../../../services/usuario.service';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';


declare const jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends AbstractComponent implements OnInit {
  constructor(private homeservice: HomeService,
              private usuarioService: UsuarioService) {
    super();
  }

  
  permissao = '';

  clickToogle() {
    this.homeservice.clickToogleHome()
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
