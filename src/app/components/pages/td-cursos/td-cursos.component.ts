import { AfterViewChecked, Component,  OnInit } from '@angular/core';
import { CursosMoodleService } from 'src/app/services/cursos-moodle.service';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';

declare var jQuery: any;

@Component({
  selector: 'app-td-cursos',
  templateUrl: './td-cursos.component.html',
  styleUrls: ['./td-cursos.component.css']
})
export class TdCursosComponent extends AbstractComponent implements OnInit, AfterViewChecked{
  moodles:any = []
  row = 0
  show = true
  countMoodles: Number = 0
  constructor(private cursosMoodleService: CursosMoodleService) 
  { 
    super()
  }
  
  
  count(){
    if(this.row < 3){
      this.row++
      this.show = false
    }else{
      this.row = 1
      this.show = true
    }
    
  }

  initrow(){
    jQuery('.rowinit')
      .before("<div class=row>")
    jQuery('.rowfinal')
       .after('</div>')
    jQuery('.panel')
       .removeClass('rowinit')
    jQuery('.panel')
       .removeClass('rowfinal')
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

  ngOnInit() {

      this.cursosMoodleService.getMoodlesComCursos().then((response) => {
      this.moodles = response ;
      this.countMoodles = this.moodles.length
    });
  }

  ngAfterViewChecked(): void {
    this.initrow()
  }



}
