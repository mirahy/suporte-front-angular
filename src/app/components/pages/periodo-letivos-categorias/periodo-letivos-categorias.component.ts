import { Component, OnInit } from '@angular/core';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { PeriodoLetivosService } from 'src/app/services/periodo-letivos.service';
import { PeriodoLetivosCategoriasService } from 'src/app/services/periodo-letivos-categorias.service';
import { PeriodoLetivo } from '../../../models/periodo-letivo';
import { FaculdadeService } from 'src/app/services/faculdade.service';
import { CursosService } from 'src/app/services/cursos.service';
import { Curso } from '../../../models/curso';

@Component({
    selector: 'app-periodo-letivos-categorias',
    templateUrl: './periodo-letivos-categorias.component.html',
    styleUrls: ['./periodo-letivos-categorias.component.less']
})
export class PeriodoLetivosCategoriasComponent extends AbstractComponent implements OnInit {

    constructor(private periodoLetivosService:PeriodoLetivosService, private periodoLetivoCategoriasService:PeriodoLetivosCategoriasService, 
        private faculdadeService:FaculdadeService, private cursosService:CursosService) { 
        super();
    }

    periodoLetivo:PeriodoLetivo = PeriodoLetivo.generatePeriodoLetivo();
    emAlteracao:boolean = false;
    cursoSelecionado:Curso = Curso.generateCurso();
    categoriaIdTemp:number | undefined;
    criteria:string = "";
    
    get periodoLetivos() {
        return this.periodoLetivosService.periodoLetivos;
    }
    get faculdades() {
        return this.faculdadeService.faculdades;
    }
    get periodoLetivosCategoriasIndex() {
        return this.periodoLetivoCategoriasService.periodoLetivosCategoriasIndex;
    }

    selecionarPeriodoLetivo(pl:any) {
        this.periodoLetivo = pl;
        this.editavel = false;
        this.getPeriodoLetivosCategorias();
        this.resetCursoSelecionado();
    }

    getCategoriaId(curso:Curso) {
        if(this.periodoLetivo.id && curso.id && this.periodoLetivosCategoriasIndex){
            return this.periodoLetivosCategoriasIndex.get(curso.id).categoria_id;
        }
        return 0;
    }

    selecionarCurso(curso:Curso) {
        this.cursoSelecionado = curso;
        this.categoriaIdTemp = this.getCategoriaId(curso);
        setTimeout (  () => {
            var categoriaIdInput = document.getElementById('categoriaIdInput');
            categoriaIdInput!.focus();
            (<HTMLInputElement>categoriaIdInput).setSelectionRange(0,(this.categoriaIdTemp+"").length);
        },150);
    }
    anularCategoria(curso:Curso){
        if(confirm("Confirmar Anulação desta Categoria?") && this.periodoLetivo.id && curso.id && this.periodoLetivosCategoriasIndex){
            this.editavel = false;
            this.periodoLetivoCategoriasService.setCategoriaId(this.periodoLetivo.id, curso.id, 0)
                .then((r : any) => {
                    this.editavel = true;
                    
                }).catch((response : any) => {
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                    alert(this.aviso);
                    this.resetCursoSelecionado();
                    this.editavel = true;
                });
        }
    }
    concluirEdicaoCategoria(curso:Curso) {
        if(this.periodoLetivo.id && curso.id && this.periodoLetivosCategoriasIndex){
            this.editavel = false;
            this.periodoLetivoCategoriasService.setCategoriaId(this.periodoLetivo.id, curso.id, this.categoriaIdTemp)
                .then((r : any) => {
                    this.editavel = true;
                    this.resetCursoSelecionado();
                }).catch((response : any) => {
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                    alert(this.aviso);
                    this.resetCursoSelecionado();
                    this.editavel = true;
                });
        }
    }
    resetCursoSelecionado() {
        this.cursoSelecionado = Curso.generateCurso();
    }

    getPeriodoLetivosCategorias () {
        this.periodoLetivoCategoriasService.getPeriodoLetivosCategrias(this.periodoLetivo.id)
            .then((r : any) => {
                this.editavel = true;
                
            }).catch((response : any) => {
                this.erroAviso = true;
                this.aviso = this.erroHttp(response);
                alert(this.aviso);
            });
    }

    ngOnInit() {
        this.faculdadeService.listar()
            .then((response : any) => {
                this.periodoLetivosService.getPeriodoLetivos()
                    .then((r : any) => {
                        this.status = this.COMPLETE;
                        this.editavel = true;
                        
                    }).catch((response : any) => {
                        this.erroAviso = true;
                        this.aviso = this.erroHttp(response);
                        this.status = this.ERROR;
                        alert(this.aviso);
                    });
            })
            .catch((response : any) => {
                this.erroAviso = true;
                this.aviso = this.erroHttp(response);
                this.status = this.ERROR;
                alert(this.aviso);
            })
        
    }

}
