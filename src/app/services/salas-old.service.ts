import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SalaOld } from '../models/sala-old';


@Injectable(
    //{ providedIn: 'root'}
)
export class SalasOldService {

    salas: Array<SalaOld> = [];
    modalidades: Array<any> = [];
    objetivosSalas: Array<any> = [];

    constructor(private http: HttpClient) { }

    atualizarSala(sala:SalaOld):Promise<boolean> {
        return this.http.post('salas-old/'+sala.id,sala)
            .toPromise()
            .then(response => {
                for (var i in this.salas )
                    if (this.salas[i].id == sala.id) {
                        this.salas[i] = sala;
                        return null;
                    }
                return response;
            })
            .catch (response => {
                return response;
            });

    }

    listar() {
        return this.http.get("/salas-old/listar")
            .toPromise()
            .then((response:any) => {
                this.salas = SalaOld.generateList(response.json().reverse());
                /*this.salasIndex = {};
                var ss = response.json();
                for (var i = 0; i < ss.length; i++) {
                    var sala = this.criaSala(ss[i]);
                    this.salasIndex[sala.id] = sala;
                    this.salas.push( sala );
                }
                this.salas.sort(this.sortSalas);*/
                return this.salas;
            });
    }

    getMensagemSala (sala:SalaOld) {
        return this.http.get("/salas-old/mensagem/"+sala.id)
            .toPromise()
            .then((response:any) => {
                return response.text();
            });
    }

    statusSala(sala:SalaOld, status:string, mensagem:string) :Promise<any> {
        return this.http.patch ('/salas-old/status/' + sala.id, {status: status, mensagem: mensagem})
            .toPromise()
            .then ((response:any) => {
                var s = response.json();
                sala.status = s.status;
                return null;
            })
            .catch (response => {
                return response;
            });
    }
    getModalidades() {
        return this.http.get ('/salas/modalidades').toPromise()
            .then ((response:any) => {
                var m = response.json();
                this.modalidades = m;
                return m
            })
    }
    getObjetivosSalas() {
        return this.http.get ('/salas/objetivos').toPromise()
            .then ((response:any) => {
                var o = response.json();
                this.objetivosSalas = o;
                return o
            })
    }
}