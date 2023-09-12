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
  permissao:string = '';

  constructor(private homeservice: HomeService,
              private usuarioService: UsuarioService) {
    super();
  }


  clickToogle() {
    this.homeservice.clickToogleHome()
  }

  ngOnInit(): void {
    this.permissao = this.usuarioService.permissao;
}


}
