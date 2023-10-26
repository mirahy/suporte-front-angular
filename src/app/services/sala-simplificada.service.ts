import { Injectable } from '@angular/core';
import { ArrayIndexador } from '../shared/array-indexador';
import { CursosService } from './cursos.service';
import { LoteSalasSimplificadoService } from './lote-salas-simplificado.service';
import { LoteSalasSimplificado } from '../models/lote-salas-simplificado';
import { PeriodoLetivosService } from './periodo-letivos.service';
import { PeriodoLetivo } from '../models/periodo-letivo';
import { PlDisciplinasAcademicos } from '../components/pages/pl-disciplinas-academicos/pl-disciplinas-academicos';
import { SalaSimplificada } from '../models/sala-simplificada';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SalaSimplificadaService {

	salasSimplificadas: Array<SalaSimplificada> = [];
	salasSimplificadasIndex: ArrayIndexador<SalaSimplificada> | any;
	salaSimplificadaSelecionada: SalaSimplificada = SalaSimplificada.generate();

	constructor(private http: HttpClient, private loteSalasSimplificadoService: LoteSalasSimplificadoService, 
        private cursosService: CursosService, private periodoLetivosService: PeriodoLetivosService) { }

    get loteSalasSimplificadoSelecionado () : LoteSalasSimplificado {
        return this.loteSalasSimplificadoService.loteSalasSimplificadoSelecionada;
    }

    reset () {
        this.salasSimplificadas = [];
        this.salasSimplificadasIndex = null;
        this.salaSimplificadaSelecionada = SalaSimplificada.generate();
    }

    list (postSelectId?:unknown) {
        return this.http.get("/salas-simplificadas/list-lote/"+ this.loteSalasSimplificadoSelecionado.id)
            .toPromise()
            .then((response:any) => {
                this.salasSimplificadas = SalaSimplificada.generateListPlus(response.json(), this.cursosService.cursosIndex!, 
                    this.periodoLetivosService.periodoLetivosIdIndex!, this.loteSalasSimplificadoSelecionado);
                this.salasSimplificadasIndex = new ArrayIndexador<SalaSimplificada>(this.salasSimplificadas);
                if (postSelectId)
                    this.salaSimplificadaSelecionada = this.salasSimplificadasIndex.get(postSelectId).clone();
                return this.salasSimplificadas;
            });
    } 

	create(salaSimplificadaPost:any) {
        return this.http.post("/salas-simplificadas",salaSimplificadaPost)
            .toPromise()
            .then((response:any) => {
                return this.list(response.json());
            });
    }

	async createAll(plDisciplinasAcademicos:Array<PlDisciplinasAcademicos>) {
        var _this = this;
        var salasIds = [];
        var createUno = function (salaSimplificadaPost:unknown) {
            return _this.http.post("/salas-simplificadas",salaSimplificadaPost)
                .toPromise()
        }
        for (var i in plDisciplinasAcademicos) {
            var salaSimplificadaPost = SalaSimplificada.generatePostSalaSimplificada(0,plDisciplinasAcademicos[i],'',
                <PeriodoLetivo> plDisciplinasAcademicos[i].periodo_letivo,this.loteSalasSimplificadoService.loteSalasSimplificadoSelecionada.id);
            var salaId:any = await createUno(salaSimplificadaPost);
            salasIds.push(salaId.text())
        }
        return this.list();
    }

	update(salaSimplificadaPost:any) {
        return this.http.put("/salas-simplificadas/"+salaSimplificadaPost.id, salaSimplificadaPost)
            .toPromise()
            .then((response:any) => {
                return this.list(response.json());
            });
    }

	refreshSala(salaId:unknown) {
        return this.http.get("/salas-simplificadas/refresh/"+salaId)
            .toPromise()
            .then((response:any) => {
                return this.list(response.json());
            });
    }

	delete(id:unknown) {
        return this.http.delete("/salas-simplificadas/"+id)
            .toPromise()
            .then(response => {
                return this.list();
            });
    }

    exportarEstudantes(salaId:unknown) {
        return this.http.get("/salas-simplificadas/estudantes/"+salaId)
            .toPromise()
            .then((response:any) => {
                return response.text();
            });
    }

    executarRestauracaoSala(salaId:unknown, macroId:unknown, courseImportId?:unknown) {
        return this.http.get ('/salas-simplificadas/autorestore/' + salaId + "/" + macroId + ( courseImportId ? "/" + courseImportId : '')).toPromise()
            .then ((response:any) => {
                return response.text();
            })
    }

    getMacro (salaId:unknown) {
        return this.http.get("/salas-simplificadas/macro/"+salaId)
            .toPromise()
            .then((response:any) => {
                return response.json();
            });
    }
}
