import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/services/cursos.service';
import { FaculdadeService } from 'src/app/services/faculdade.service';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { Faculdade } from './faculdade';
declare var jQuery: any;

@Component({
    selector: 'app-faculdades',
    templateUrl: './faculdades.component.html',
    styleUrls: ['./faculdades.component.less']
})
export class FaculdadesComponent extends AbstractComponent implements OnInit {

    constructor(private faculdadeService:FaculdadeService, private cursosService:CursosService) {
        super();
    }

    get faculdades() {
        return this.faculdadeService.faculdades;
    }
    get faculdadeSelecionada():Faculdade {
        return this.cursosService.faculdadeSelecionada;
    }
    set faculdadeSelecionada(faculdade:Faculdade) {
        this.cursosService.faculdadeSelecionada = faculdade
    }

    eu () {
        return this;
    }

    nova() {
        this.faculdadeSelecionada = Faculdade.generateFaculdade();
        this.aviso = "";
    }

    selecionar (faculdade:Faculdade) {
        this.faculdadeSelecionada = faculdade.clone();
        this.aviso = "";
    }

    criaAltera(ev : any){
        ev.preventDefault();
        var faculdadeForm = jQuery('#faculdadeForm')[0];
		if (faculdadeForm.reportValidity()) {
            if (this.faculdadeSelecionada.id)
                this.altera();
            else
                this.cria();
		}
        
    }

    cria() {
        this.editavel = false;
        this.faculdadeService.create(this.faculdadeSelecionada)
            .then((response : any) => {
                jQuery('#dialogCreate').modal('hide');
                this.editavel = true;
            })
            .catch((response : any) => {
                this.aviso = this.erroHttp(response);
                alert(this.aviso);
                this.editavel = true;
            });
    }

    altera () {
        this.editavel = false;
        this.faculdadeService.update(this.faculdadeSelecionada)
            .then((response : any) => {
                jQuery('#dialogCreate').modal('hide');
                this.editavel = true;
            })
            .catch((response : any) => {
                this.aviso = this.erroHttp(response);
                alert(this.aviso);
                this.editavel = true;
            });
    }

    remove () {
        if (confirm("Confirmar exclusão desta facudade?")) {
            this.editavel = false;
            this.faculdadeService.delete(this.faculdadeSelecionada)
                .then((response : any) => {
                    this.editavel = true;
                    this.faculdadeSelecionada = Faculdade.generateFaculdade();
                })
                .catch((response : any) => {
                    this.aviso = this.erroHttp(response);
                    alert(this.aviso);
                    this.editavel = true;
                });
        }
        
    }

    ngOnInit() {
        this.faculdadeService.listar()
            .then((response : any) => {
                this.status = this.COMPLETE;
                this.editavel = true;
            })
            .catch((response : any) => {
                this.erroAviso = true;
                this.aviso = this.erroHttp(response);
                this.status = this.ERROR;
                alert(this.aviso);
            })
    }

}
