import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LogsService {

	constructor(private http:HttpClient) { }

	public readonly PATH_LOGS_EXPORTACOES_ESTUDANTES = "/logs/exportacao-estudantes";

	listarLogsExportEstudantes() {
		return this.http.get(this.PATH_LOGS_EXPORTACOES_ESTUDANTES)
			.toPromise()
			.then((response:any) => {
				return response.json();
			});
	}
}
