import { Component, OnInit } from '@angular/core';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { LogsService } from 'src/app/services/logs.service';

@Component({
	selector: 'app-logs',
	templateUrl: './logs.component.html',
	styleUrls: ['./logs.component.less']
})
export class LogsComponent extends AbstractComponent implements OnInit {

	constructor(private logsService:LogsService) {
		super();
	}

	logsExportsEstudantes: Array<any> = []

	get pathLogsExportacaoEstudantes () {
		return this.logsService.PATH_LOGS_EXPORTACOES_ESTUDANTES;
	}

	ngOnInit() {
		this.logsService.listarLogsExportEstudantes()
			.then((response : any) => {
				this.logsExportsEstudantes = response;
			})
			.catch((response : any) => {
				this.status = this.ERROR;
				console.log(response)
			})
	}

}
