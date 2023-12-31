import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodoLetivoCategoria } from '../models/periodo-letivo-categoria';
import { ArrayIndexador } from '../shared/array-indexador';

@Injectable()
export class PeriodoLetivosCategoriasService {

    periodoLetivosCategorias:Array<PeriodoLetivoCategoria> = [];
    periodoLetivosCategoriasIndex!: ArrayIndexador<PeriodoLetivoCategoria>;

    constructor(private http: HttpClient) { }

    getPeriodoLetivosCategrias(periodoLetivoId:number) {
        return this.http.get("/periodo-letivos-categorias/all/"+periodoLetivoId).toPromise()
            .then((response:any) => {
                var plcs = response.json();

                this.periodoLetivosCategorias = PeriodoLetivoCategoria.generateList(response.json());
                this.periodoLetivosCategoriasIndex = new ArrayIndexador<PeriodoLetivoCategoria>(this.periodoLetivosCategorias,"curso");
                return this.periodoLetivosCategoriasIndex;
            });
    }

    setCategoriaId(periodoLetivoId:string|number, cursoId:string|number, categoriaId:string|number|undefined) {
        return this.http.post("/periodo-letivos-categorias",{'periodo_letivo_id': periodoLetivoId, 'curso_id': cursoId, 'categoria_id': categoriaId}).toPromise()
            .then(response => {
                this.periodoLetivosCategoriasIndex.get(cursoId).categoria_id = categoriaId;
                return categoriaId;
            });
    }
}
