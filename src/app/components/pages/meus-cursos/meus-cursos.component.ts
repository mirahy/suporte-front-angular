import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { CursosMoodleService } from "src/app/services/cursos-moodle.service";
import { AbstractComponent } from "src/app/shared/components/abstract-component";

declare var jQuery: any;

@Component({
  selector: "app-meus-cursos",
  templateUrl: "./meus-cursos.component.html",
  styleUrls: ["./meus-cursos.component.css"],
})
export class MeusCursosComponent extends AbstractComponent implements OnInit {
  moodles:any = [];
  emptyCursos = false;
  constructor(private cursosMoodleService: CursosMoodleService, private router: Router) {
    super();
  }

  goMoodle(idMoodle:string, IdCurso:string){
    this.cursosMoodleService.goMoodle(idMoodle, IdCurso).then((response) => {
      console.log(response)
      jQuery('#curso' + IdCurso + idMoodle).attr('href', response.text())
    });
  }

  collapse(id:string){
    this.cursosMoodleService.functionCollapse(id);
  }

  removeLoading(){
    jQuery('.loading')
      .remove()
  }

  ngOnInit() {
    this.cursosMoodleService.getMoodlesComCursos(6).then((response) => {
      this.moodles = response ;
      let i = 0;
      this.moodles.forEach((element:any) => {
        
          if(element.cursos.length !== 0){
            i++
          }
      });
      if(!i){
        this.emptyCursos = true
      } 
    });
  }
}
