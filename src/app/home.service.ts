import { Injectable } from '@angular/core';

declare var jQuery: any;

@Injectable()
export class HomeService {

  constructor() { }

  clickToogle(){

    let guias = ['solicitacoes', 'universidade', 'administracao', 'gestaoUsuarios'];
      // ocultar guia aberta ao abrir outra
      jQuery('div').removeClass('in');
        guias.forEach((element) => {
          //Alterar seta para baixo de todas as guias ao clicar
          jQuery('#img' + element).removeClass('bi-caret-up-fill');
          jQuery('#img' + element).addClass('bi-caret-down-fill');
        });
      
      //Alterar seta para cima somente da guia em aberto
      guias.forEach((element:any) => {
        jQuery('#' + element).on('show.bs.collapse', function () {
          jQuery('#img' + element).removeClass('bi-caret-down-fill');
          jQuery('#img' + element).addClass('bi-caret-up-fill');
        });
      });
  
  }
}
