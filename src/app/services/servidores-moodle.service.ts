import { Injectable } from '@angular/core';
import { ServidorMoodle } from '../models/servidor-moodle';
import { ArrayIndexador } from '../shared/array-indexador';
import { Estudante } from '../models/estudante';
import { HttpClient } from '@angular/common/http';
import { TempWebRequestsService } from './temp-web-requests.service';

@Injectable()
export class ServidoresMoodleService {

    constructor(private http: HttpClient, private web:TempWebRequestsService) { }

    servidoresMoodle: Array<ServidorMoodle> = [];
    servidoresMoodleIndex: ArrayIndexador<ServidorMoodle> = new ArrayIndexador([]);

    getServidoresMoodle() {
        return this.http.get("/servidores-moodle/all").toPromise()
            .then((response:any) => {
                var sms = response.json();
                this.servidoresMoodle = [];
                this.servidoresMoodleIndex = new ArrayIndexador([]);
                for (var i in sms) {
                    var sm = new ServidorMoodle(sms[i]);
                    this.servidoresMoodle.push(sm);
                    this.servidoresMoodleIndex.add(sm);
                }
                return this.servidoresMoodle;
            });
    }

    getLinksServidoresMoodle () {
        return this.web.get("servidores-moodle/links")
        // return this.http.get("/servidores-moodle/links").toPromise()
            .then((response:any) => {
                return response.data;
            });
    }

    createUpdate(sm: ServidorMoodle) {
        if (sm.id) {
            return this.http.put("/servidores-moodle/" + sm.id, sm).toPromise()
                .then((response:any) => {
                    this.getServidoresMoodle();
                    return response.json();
                });
        }
        else {
            return this.http.post("/servidores-moodle/", sm).toPromise()
                .then((response:any) => {
                    this.getServidoresMoodle();
                    return response.json();
                });
        }
    }

    delete(sm: ServidorMoodle) {
        return this.http.delete("/servidores-moodle/" + sm.id).toPromise()
            .then((response:any) => {
                this.getServidoresMoodle();
                return response.json();
            });
    }

    exportarEstudantes(estudantes:unknown, servidorMoodle:unknown, courseId:unknown, senhaPadrao:unknown) {
        return this.http.post("/formulario-insere-usuarios", {estudantes: estudantes, servidorMoodle: servidorMoodle, courseId:courseId, senhaPadrao:senhaPadrao} ).toPromise()
            .then((response:any) => {
                return response.text();
            });
    }

    getAcademicosDisciplinasSigecad(codDisciplina:unknown, periodoLetivoIdSigecad:unknown, turmaId:unknown, turmaNome:unknown){
        return this.http.get("/pl-disciplinas-academicos/academicos-disciplinas-sigecad/" + codDisciplina + "/" + periodoLetivoIdSigecad + "/" + turmaId + "/" + turmaNome).toPromise()
            .then((response:any) => {
                //return response.json();
                var estudantes = Estudante.converteJSONParaEstudantesComSenha( Estudante.converteEstudantesParaJSON( response.json() ) );
                return estudantes;
            });
    }
}
