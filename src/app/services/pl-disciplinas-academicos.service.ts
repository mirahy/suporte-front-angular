import { Injectable } from '@angular/core';
import { PlDisciplinasAcademicos } from '../components/pages/pl-disciplinas-academicos/pl-disciplinas-academicos';
import { ArrayIndexador } from '../shared/array-indexador';
import { Estudante } from '../components/pages/pl-disciplinas-academicos/estudante';
import { HttpClient } from '@angular/common/http';
import { Curso } from '../components/pages/cursos/curso';
import { PeriodoLetivo } from '../components/pages/periodo-letivos/periodo-letivo';

@Injectable()
export class PlDisciplinasAcademicosService {

    plDisciplinasAcademicos:Array<PlDisciplinasAcademicos> = [];
    plDisciplinasAcademicosIndex:ArrayIndexador<PlDisciplinasAcademicos> | undefined;
    plDisciplinasAcademicosNameIndex:ArrayIndexador<PlDisciplinasAcademicos> | undefined;
    //plDisciplinasAcademicosCodigoIndex:ArrayIndexador<PlDisciplinasAcademicos> = null;

    constructor(private http: HttpClient) { }

    getPlDisciplinasAcademicos(periodoLetivoId:unknown, cursoId:unknown, cursosKeyIndex?:ArrayIndexador<Curso>, periodoLetivosNomeIndex?:ArrayIndexador<PeriodoLetivo>|any) {
        return this.http.get("/pl-disciplinas-academicos/find/" + periodoLetivoId + "/" + cursoId).toPromise()
            .then((response:any) => {
                if (cursosKeyIndex)
                    this.plDisciplinasAcademicos = PlDisciplinasAcademicos.generateListPlus(response.json(), cursosKeyIndex, periodoLetivosNomeIndex);
                else 
                    this.plDisciplinasAcademicos = PlDisciplinasAcademicos.generateList(response.json());
                this.plDisciplinasAcademicos = this.difereTurmas(this.plDisciplinasAcademicos);
                this.plDisciplinasAcademicosNameIndex = new ArrayIndexador<PlDisciplinasAcademicos>(this.plDisciplinasAcademicos,"disciplina");
                //this.plDisciplinasAcademicosNameIndex = new ArrayIndexador<PlDisciplinasAcademicos>(this.plDisciplinasAcademicos,"disciplina_key");
                this.plDisciplinasAcademicosIndex = new ArrayIndexador<PlDisciplinasAcademicos>(this.plDisciplinasAcademicos);
                return this.plDisciplinasAcademicosIndex;
            });
    }

    private difereTurmas(plDAList:Array<PlDisciplinasAcademicos>) {
        var indices:any = {};//new ArrayIndexador<PlDisciplinasAcademicos>(plDAList, "disciplina");
        var pares:any = {};
        for (var i = 0; i < plDAList.length; i++) {
            if (indices.hasOwnProperty(plDAList[i]['disciplina'])) {
                if (pares.hasOwnProperty (plDAList[i]['disciplina'])) 
                    pares[plDAList[i]['disciplina']].push(i);
                else 
                    pares[plDAList[i]['disciplina']] = [indices[plDAList[i]['disciplina']], i];
            }
            else
                indices[plDAList[i]['disciplina']] = i;
        }

        for (var j in pares) {
            for (var k in pares[j]) {
                plDAList[pares[j][k]].disciplina = j + " - " + plDAList[pares[j][k]].turma_nome;
            }
        }
        return plDAList;
    }

    criarAlterarDisciplina(plDisciplinasAcademicos:PlDisciplinasAcademicos) {
        var res = function (this: any, response:any) {
            if (plDisciplinasAcademicos.id)
            this.plDisciplinasAcademicos = PlDisciplinasAcademicos.generateList(response.json());
            this.plDisciplinasAcademicosIndex = new ArrayIndexador<PlDisciplinasAcademicos>(this.plDisciplinasAcademicos);
            return this.plDisciplinasAcademicosIndex;
        }
        if (plDisciplinasAcademicos.id)
            return this.http.put("/pl-disciplinas-academicos/"+plDisciplinasAcademicos.id, plDisciplinasAcademicos.toForm()).toPromise()
                .then((r:any) => {
                    var plc = r.json()
                    this.plDisciplinasAcademicosIndex!.get(plc.id).disciplina = plc.disciplina;
                    return plc.id;
                });
        else
            return this.http.post("/pl-disciplinas-academicos", plDisciplinasAcademicos.toForm()).toPromise()
                .then((r:any) => {
                    var plc = r.json();
                    this.plDisciplinasAcademicosIndex!.add(new PlDisciplinasAcademicos(plc.id, plc.curso_id, plc.periodo_letivo_id, plc.disciplina, []));
                    console.log(this.plDisciplinasAcademicos)
                    return plc.id;
                });
    }

    removeDisciplina(plcId: string) {
        return this.http.delete("/pl-disciplinas-academicos/"+ plcId).toPromise()
            .then(response => {
                this.plDisciplinasAcademicosIndex!.remove(plcId);
                return plcId;
            });
    }

    getEstudantes(plDisciplinasAcademicosId: string | number, isListaCompleta:boolean):Promise<Array<Estudante>> {
        return this.http.get("/pl-disciplinas-academicos/estudantes/" + plDisciplinasAcademicosId + (isListaCompleta ?  "/" + isListaCompleta : "") ).toPromise()
            .then((response:any) => {
                var estudantes = Estudante.converteJSONParaEstudantes(response.text());
                return estudantes;
            });
    }

    setEstudantes(plDisciplinasAcademicosId: string, estudantes:Array<Estudante>):Promise<Array<Estudante>> {
        return this.http.put("/pl-disciplinas-academicos/estudantes/" + plDisciplinasAcademicosId, {'estudantes' : Estudante.converteEstudantesParaJSON(estudantes)}).toPromise()
            .then((response:any) => {
                var estudantes = Estudante.converteJSONParaEstudantes(response.text());
                return estudantes;
            });
    }

    uploadFileEstudantes(periodoLetivoId: string, file:File) {
        const formData: FormData = new FormData();
        if (periodoLetivoId && file) {
            formData.append('arquivo', file, file.name);
            return this.http.post("/pl-disciplinas-academicos/estudantes/" + periodoLetivoId, formData).toPromise()
                .then((r:any) => {
                    return r.json();
                });
        }
        return null;
    }

    
    getCursosSigecad(periodoLetivoId: string) {
        return this.http.get("/pl-disciplinas-academicos/carrega-cursos-sigecad/" + periodoLetivoId).toPromise()
            .then((response:any) => {
                return response.json();
            });
    }

    getDisciplinasCursoSigecad(periodoLetivoIdSigecad: string, siglaFaculdade: string, codCurso: string){
        return this.http.get("/pl-disciplinas-academicos/disciplinas-curso-sigecad/" + periodoLetivoIdSigecad + "/" + siglaFaculdade + "/" + codCurso).toPromise()
            .then((response:any) => {
                return response.json();
            });
    }

    getAcademicosDisciplinasSigecad(codDisciplina: string, periodoLetivoIdSigecad: string, turmaId: string, turmaNome: string, salaId: string | number){
        return this.http.get("/pl-disciplinas-academicos/academicos-disciplinas-sigecad/" + codDisciplina + "/" + periodoLetivoIdSigecad + "/" + turmaId + "/" + turmaNome + "/" + salaId).toPromise()
            .then((response:any) => {
                //return response.json();
                var estudantes = Estudante.converteJSONParaEstudantes( Estudante.converteEstudantesParaJSON( response.json() ) );
                return estudantes;
            });
    }
}
