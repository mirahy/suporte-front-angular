import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ApiRequestsService } from "./api-requests.service";

declare var jQuery: any;

@Injectable()
export class CursosMoodleService {

  constructor(private http: HttpClient, private api : ApiRequestsService) {}

  async getMoodles(idArray = [1,2]) {
    let idMoodles = {'idMoodles' : idArray}
    return this.api
      .post("get-moodles", idMoodles)
      .then((response: any) => {
        return response;
    
      });
  }

  async getMoodlesComCursos(paramMeses: Number) {
    let meses  = {'ultimosMeses' : paramMeses}
    return this.api
      .post("get-meus-cursos", meses)
      .then((response: any) => {
        return response.data;
      });
  }

  async goMoodle(idMoodle:string, IdCurso:string) {
    let params  = {'idMoodles' : [idMoodle], 'idCurso' : IdCurso }
    return this.api
      .post("go-moodle", params)
      .then((response: any) => {
        return response;
      });
  }

  functionCollapse(id:string) {
    if(jQuery('#btnMoodlecollapse' + id).hasClass('collapsed')){
      //Alterar seta para cima somente da guia em aberto
      jQuery('#caretMoodlecollapse' + id).removeClass('bi-caret-down-fill');
      jQuery('#caretMoodlecollapse' + id).addClass('bi-caret-up-fill');
    }else{
      //Alterar seta para baixo  da guia fechada
      jQuery('#caretMoodlecollapse' + id).removeClass('bi-caret-up-fill');
      jQuery('#caretMoodlecollapse' + id).addClass('bi-caret-down-fill');
    }
}
}
