import { Component, OnInit } from '@angular/core';
import { AbstractComponent } from '../abstract-component';
import { RecursoService } from '../recurso.service';
import { Recurso } from './recurso';

@Component({
    selector: 'app-recurso',
    templateUrl: './recurso.component.html',
    styleUrls: ['./recurso.component.less']
})
export class RecursoComponent extends AbstractComponent implements OnInit {

    readonly LOADING_GESTORES = 0;
    readonly COMPLETE_GESTORES = 1;
    readonly ERROR_GESTORES = 2;
    readonly RECNULL_GESTORES = 3;
    statusGestores:Number = this.RECNULL_GESTORES;

    constructor(private recursoService:RecursoService) {
        super();
    }

    get recursos () {
        return this.recursoService.recursos;
    }

    set recursos(recursos) {
        this.recursoService.recursos = recursos;
    }

    get recursoSelecionado():Recurso {
        return this.recursoService.recursoSelecionado;
    }

    set recursoSelecionado(recurso:Recurso) {
        this.recursoService.recursoSelecionado = recurso;
    }

    selecionarRecurso(recurso:Recurso) {
        if (this.recursoSelecionado.id != recurso.id) {
            this.recursoSelecionado = recurso;
            this.statusGestores = this.LOADING_GESTORES;
            this.recursoSelecionado.gestores = [];
            this.recursoService.obtemGestoresRecurso()
                .then((response : any) => {
                    this.statusGestores = this.COMPLETE_GESTORES;
                })
                .catch ((response : any) => {
                    this.statusGestores = this.ERROR_GESTORES;
                })
        }
        
    }

    removeGestor(usuario : any) {
        if (confirm("Confirmar Remoção deste Gestor?"))
        this.recursoService.removeGestorRecurso(usuario) 
            .then((response : any) => {

            })
            .catch ((response : any) => {

            })
    }

    addGestor(usuario : any) {
        if (confirm("Confirmar Adição deste Gestor?"))
        this.recursoService.adicionaGestorRecurso(usuario)
            .then((response : any) => {

            })
            .catch ((response : any) => {

            })
    }

    ngOnInit() {
        this.status = this.LOADING;
        this.recursoService.listar()
            .then(response => {
                this.status = this.COMPLETE;
            })
            .catch (response => {
                this.status = this.ERROR;
            });
    }

}
