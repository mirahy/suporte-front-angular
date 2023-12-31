import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recurso } from '../models/recurso';
import { Usuario } from '../models/usuario';

@Injectable()
export class RecursoService {

    recursos:Array<Recurso> = [];
    recursosIndex:any = {};
    recursoSelecionado:Recurso = new Recurso(0,"","");

    constructor(private http: HttpClient) { }

    listar(): Promise<Array<any>> {
        return this.http.get("/recursos/listar").toPromise()
            .then((response:any) => {
                var lista = response.json();
                this.recursos = [];
                this.recursosIndex = {};
                for (var i in lista) {
                    var r = new Recurso(lista[i]);
                    this.recursos.push(r)
                    this.recursosIndex[r.id] = i;
                }
                return this.recursos;
            });
    }

    obtemGestoresRecurso():Promise<Array<Usuario>> {
        return this.http.get("/recursos/"+this.recursoSelecionado.id+"/gestores").toPromise()
            .then((response:any) => {
                var lista = response.json();
                this.recursoSelecionado.gestores = [];
                
                for(var i in lista) {
                    var u = new Usuario(lista[i]);
                    this.recursoSelecionado.gestores.push (u);
                }
                return this.recursoSelecionado.gestores;
            });
    }

    adicionaGestorRecurso(usuario:Usuario) {
        return this.http.get("/recursos/attach/"+this.recursoSelecionado.id+"/"+usuario.id).toPromise() 
            .then(response => {
                this.listar();
            })
    }

    removeGestorRecurso(usuario:Usuario) {
        return this.http.get("/recursos/detach/"+this.recursoSelecionado.id+"/"+usuario.id).toPromise() 
            .then(response => {
                this.listar();
            })
    }
}
