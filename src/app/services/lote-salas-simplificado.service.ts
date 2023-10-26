import { Injectable } from '@angular/core';
import { ArrayIndexador } from '../shared/array-indexador';
import { GrupoLotesSimplificado } from '../components/pages/lote-salas-simplificado/grupo-lotes-simplificado';
import { LoteSalasSimplificado } from '../models/lote-salas-simplificado';
import { ServidoresMoodleService } from './servidores-moodle.service';
import { SuperMacroService } from './super-macro.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoteSalasSimplificadoService {


	loteSalasSimplificados: Array<LoteSalasSimplificado> = [];
	loteSalasSimplificadosIndex: ArrayIndexador<LoteSalasSimplificado> | undefined;
	loteSalasSimplificadoSelecionada: LoteSalasSimplificado = LoteSalasSimplificado.generate();

    grupoLotesSelecionado: GrupoLotesSimplificado = GrupoLotesSimplificado.generate();

	constructor(private http: HttpClient, private superMacrosService:SuperMacroService, private servidoresMoodleService:ServidoresMoodleService) { }

	listar() {
		return this.http.get("/lote-salas-simplificados/all/" + this.grupoLotesSelecionado.id)
			.toPromise()
			.then((response:any) => {
				this.loteSalasSimplificados = LoteSalasSimplificado.generateListPlus(response.json(), this.superMacrosService.superMacrosIndex!, this.servidoresMoodleService.servidoresMoodleIndex);
				this.loteSalasSimplificadosIndex = new ArrayIndexador<LoteSalasSimplificado>(this.loteSalasSimplificados);
				return this.loteSalasSimplificados;
			});
	}

	create(loteSalasSimplificado:LoteSalasSimplificado) {
        return this.http.post("/lote-salas-simplificados",loteSalasSimplificado.getPost())
            .toPromise()
            .then(response => {
                return this.listar();
            });
    }
    update(loteSalasSimplificado:LoteSalasSimplificado) {
        return this.http.put("/lote-salas-simplificados/"+loteSalasSimplificado.id,loteSalasSimplificado.getPost())
            .toPromise()
            .then(response => {
                return this.listar();
            });
    }
    delete(loteSalasSimplificado:LoteSalasSimplificado) {
        return this.http.delete("/lote-salas-simplificados/"+loteSalasSimplificado.id)
            .toPromise()
            .then(response => {
                return this.listar();
            });
    }

    executaExportacoes(loteSalasSimplificado:LoteSalasSimplificado) {
        return this.http.get("/lote-salas-simplificados/exportacao/"+loteSalasSimplificado.id)
            .toPromise()
            .then((response:any) => {
                return response.text();
            });
    }

    exportarEstudantes(loteSalasSimplificado:LoteSalasSimplificado) {
        return this.http.get("/lote-salas-simplificados/estudantes/"+loteSalasSimplificado.id)
            .toPromise()
            .then((response:any) => {
                return response.text();
            });
    }
}
