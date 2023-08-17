import { Injectable } from '@angular/core';
import { ArrayIndexador } from './array-indexador';
import { GrupoLotesSimplificado } from './lote-salas-simplificado/grupo-lotes-simplificado';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GrupoLotesSimplificadosService {

	constructor(private http:HttpClient) { }

	grupos: Array<GrupoLotesSimplificado> = [];
	gruposIndex: ArrayIndexador<GrupoLotesSimplificado> | undefined;
    grupoSelecionadoId: any = "";

	listar(selectId?:number) {
		return this.http.get("/grupo-lotes-simplificados/all")
			.toPromise()
			.then((response: any) => {
				this.grupos = GrupoLotesSimplificado.generateList(response.json());
				this.gruposIndex = new ArrayIndexador<GrupoLotesSimplificado>(this.grupos);
                if (selectId)
                    this.grupoSelecionadoId = selectId;
				return this.grupos;
			});
	}

	create(grupo:GrupoLotesSimplificado) {
        return this.http.post("/grupo-lotes-simplificados",grupo.getPost())
            .toPromise()
            .then((response: any) => {
                return this.listar(response.json());
            });
    }
    update(grupo:GrupoLotesSimplificado) {
        return this.http.put("/grupo-lotes-simplificados/"+grupo.id,grupo.getPost())
            .toPromise()
            .then(response => {
                return this.listar(grupo.id);
            });
    }
    delete(grupo:GrupoLotesSimplificado) {
        return this.http.delete("/grupo-lotes-simplificados/"+grupo.id)
            .toPromise()
            .then(response => {
                this.grupoSelecionadoId = "";
                return this.listar();
            });
    }
    exportarEstudantes(grupo:GrupoLotesSimplificado) {
        return this.http.get("/grupo-lotes-simplificados/estudantes/"+grupo.id)
            .toPromise()
            .then((response:any) => {
                return response.text();
            });
    }
}
