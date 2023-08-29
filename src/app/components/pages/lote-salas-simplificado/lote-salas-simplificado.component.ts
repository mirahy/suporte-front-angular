import { Component, OnInit } from '@angular/core';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { GrupoLotesSimplificadosService } from 'src/app/services/grupo-lotes-simplificados.service';
import { LoteSalasSimplificadoService } from 'src/app/services/lote-salas-simplificado.service';
import { MacroService } from 'src/app/services/macro.service';
import { SalaSimplificadaService } from 'src/app/services/sala-simplificada.service';
import { ServidoresMoodleService } from 'src/app/services/servidores-moodle.service';
import { SuperMacroService } from 'src/app/services/super-macro.service';
import { GrupoLotesSimplificado } from './grupo-lotes-simplificado';
import { LoteSalasSimplificado } from './lote-salas-simplificado';
declare var jQuery: any;

@Component({
	selector: 'app-lote-salas-simplificado',
	templateUrl: './lote-salas-simplificado.component.html',
	styleUrls: ['./lote-salas-simplificado.component.less']
})
export class LoteSalasSimplificadoComponent extends AbstractComponent implements OnInit {

	constructor(private loteSalasSimplificadoService: LoteSalasSimplificadoService, private salaSimplificadaService: SalaSimplificadaService, 
		private grupoLotesSimplificadosService: GrupoLotesSimplificadosService,
		private macroService:MacroService, private superMacroService: SuperMacroService, private servidoresMoodleService: ServidoresMoodleService) { 
		super();
	}

	superMacroSelecionadaId:number|unknown;
	servidorMoodleSelecionadoId:number|unknown ; 

	grupoLoteSimplificadoTemp = GrupoLotesSimplificado.generate();

	get lotes () {
		return this.loteSalasSimplificadoService.loteSalasSimplificados;
	}
	set lotes (loteSalasSimplificados) {
		this.loteSalasSimplificadoService.loteSalasSimplificados = loteSalasSimplificados;
	}
	get loteSelecionado () {
		return this.loteSalasSimplificadoService.loteSalasSimplificadoSelecionada;
	}
	set loteSelecionado (lote) {
		this.loteSalasSimplificadoService.loteSalasSimplificadoSelecionada = lote;
	}
	get servidoresMoodle () {
		return this.servidoresMoodleService.servidoresMoodle;
	}
	get superMacros () {
		return this.superMacroService.superMacros;
	}
	get grupoSelecionadoId() {
		return this.grupoLotesSimplificadosService.grupoSelecionadoId;
	}
	set grupoSelecionadoId(grupoSelecionadoId) {
		this.grupoLotesSimplificadosService.grupoSelecionadoId = grupoSelecionadoId;
	}
	get gruposLotesSimplificados() {
		return this.grupoLotesSimplificadosService.grupos;
	}
	/*set gruposLotesSimplificados(grupoLotesSimplificados) {
		this.grupoLotesSimplificadosService.grupos = grupoLotesSimplificados;
	}*/
	get grupoLotesSimplificadosSelecionado() {
		return this.loteSalasSimplificadoService.grupoLotesSelecionado;
	}
	set grupoLotesSimplificadosSelecionado(g) {
		this.loteSalasSimplificadoService.grupoLotesSelecionado = g;
	}
	
	get eu() {
        return this;
    }

	resetGrupo() {
		this.grupoLotesSimplificadosSelecionado = GrupoLotesSimplificado.generate();
		this.grupoLoteSimplificadoTemp = GrupoLotesSimplificado.generate();
		this.grupoSelecionadoId = "";
		this.lotes = [];
		this.novoLote();
	}

	selecionaGrupoLotes() {
		var grupoTemp = this.grupoLotesSimplificadosService.gruposIndex!.get(this.grupoSelecionadoId);
		if (!grupoTemp)
			grupoTemp = GrupoLotesSimplificado.generate();
		this.grupoLotesSimplificadosSelecionado = grupoTemp;
		this.grupoLoteSimplificadoTemp = grupoTemp.clone();
		this.editavel = false;
		this.loteSalasSimplificadoService.listar()
			.then((response : any) => {
				this.editavel = true;
				this.novoLote();
			})
			.catch((response : any) => {
				this.erroAviso = true;
				this.aviso = this.erroHttp(response);
				this.status = this.ERROR;
				alert(this.aviso);
			})
	}

	criarAlterarGrupoLote (ev:any) {
		ev.preventDefault();
        var loteSalasForm = jQuery('#grupoLoteForm')[0];
		if (loteSalasForm.reportValidity()) {
			this.editavel = false;
            if (this.grupoLoteSimplificadoTemp.id) {
				this.grupoLotesSimplificadosService.update(this.grupoLoteSimplificadoTemp)
					.then((response : any) => {
						jQuery('#dialogCreateGrupoLSS').modal('hide');
						this.editavel = true;
					})
					.catch((response : any) => {
						this.aviso = this.erroHttp(response);
						alert(this.aviso);
						this.editavel = true;
					});
			}
            else {
				this.grupoLotesSimplificadosService.create(this.grupoLoteSimplificadoTemp)
					.then((response : any) => {
						jQuery('#dialogCreateGrupoLSS').modal('hide');
						this.selecionaGrupoLotes();
						this.editavel = true;
					})
					.catch((response : any) => {
						this.aviso = this.erroHttp(response);
						alert(this.aviso);
						this.editavel = true;
					});
			}
		}
	}
	removeGrupo() {
		if (confirm ("Confirmar exclusão do Grupo '"+this.grupoLoteSimplificadoTemp.descricao+"'?") &&
			confirm ("ATENÇÃO!\nEsta ação removerá todos os lotes de salas associadas a este grupo e todas as respectivas salas associadas a estes lotes!\n Deseja prosseguir com a exclusão?"))
		this.grupoLotesSimplificadosService.delete(this.grupoLoteSimplificadoTemp)
			.then ((response : any) => {
				this.grupoLotesSimplificadosService.listar()
				this.resetGrupo();
			})
			.catch((r : any) => {
				alert(this.erroHttp(r));
			});
	}

	inserirEstudantesGrupo() {
		if (confirm ("Deseja inserir estudantes em todos as salas de todos os lotes deste grupo?") ){
			this.erroAviso = false;
			this.aviso = '';
			jQuery('#dialogExportResult').modal('show');
			jQuery('#saidaExport').html("<i>Aguarde...<i>");
			this.editavel = false;
			//this.blockAutoRestore = true;
			this.grupoLotesSimplificadosService.exportarEstudantes(this.grupoLotesSimplificadosSelecionado)
				.then((response : any) => {
					jQuery('#saidaExport').html(response);
					this.editavel = true;
				})
				.catch((response : any) => {
					this.erroAviso = true;
					this.aviso = this.erroHttp(response);
					this.editavel = true;
					jQuery('#saidaExport').html('<span style="color: red;">'+this.aviso+"</span>");
				});
		}
	}

    criarAlterarLoteSalasSimplificado(ev:any) {
        ev.preventDefault();
        var loteSalasForm = jQuery('#loteSalasSimplificadoForm')[0];
		if (loteSalasForm.reportValidity()) {
            if (this.loteSelecionado.id)
                this.alteraLote();
            else
                this.criaLote();
		}
    }

	novoLote() {
		this.limpar();
		this.loteSelecionado = LoteSalasSimplificado.generate();
		this.loteSelecionado.grupo_id = this.grupoLotesSimplificadosSelecionado.id;
		this.servidorMoodleSelecionadoId = "";
		this.superMacroSelecionadaId = "";
		this.salaSimplificadaService.reset();
	}

	selecionar(lote:LoteSalasSimplificado){
		this.limpar();
		this.loteSelecionado = lote.clone();
		this.servidorMoodleSelecionadoId = this.loteSelecionado.servidor_moodle ? this.loteSelecionado.servidor_moodle.id : "";
		this.superMacroSelecionadaId = this.loteSelecionado.super_macro ? this.loteSelecionado.super_macro.id : "";
		this.salaSimplificadaService.list();
	}

	criaLote() {
        this.editavel = false;
        this.loteSalasSimplificadoService.create(this.loteSelecionado)
            .then((response : any) => {
                jQuery('#dialogCreateLSS').modal('hide');
                this.editavel = true;
            })
            .catch((response : any) => {
                this.aviso = this.erroHttp(response);
                alert(this.aviso);
                this.editavel = true;
            });
    }

    alteraLote () {
        this.editavel = false;
        this.loteSalasSimplificadoService.update(this.loteSelecionado)
            .then((response : any) => {
                jQuery('#dialogCreateLSS').modal('hide');
                this.editavel = true;
            })
            .catch((response : any) => {
                this.aviso = this.erroHttp(response);
                alert(this.aviso);
                this.editavel = true;
            });
    }
	removeLote(lote:LoteSalasSimplificado) {
		if (confirm ("Confirmar exclusão do Lote '"+lote.descricao+"'?"))
		this.loteSalasSimplificadoService.delete(lote)
			.then ((response : any) => {
				this.loteSalasSimplificadoService.listar()
				this.novoLote();
			})
			.catch(r => {
				alert(this.erroHttp(r));
			});
	}
	
	limpar() {
		this.aviso = '';
		this.status = this.COMPLETE;
	}

	selecionaServidorMoodle() {
		this.loteSelecionado.servidor_moodle = this.servidoresMoodleService.servidoresMoodleIndex.get(this.servidorMoodleSelecionadoId);
	}

	selecionaSuperMacro () {
		this.loteSelecionado.super_macro = this.superMacroService.superMacrosIndex!.get(this.superMacroSelecionadaId);
	}

	exportarSalasMoodle() {
		this.editavel = false;
        if(this.loteSelecionado && confirm ("Deseja executar as exportações automáticas das salas deste lote?") ) {
            this.loteSalasSimplificadoService.executaExportacoes(this.loteSelecionado)
                .then((response : any) => {
                    jQuery('#dialogExportResult').modal('show');
                    jQuery('#saidaExport').html(response);
                    this.editavel = true;
					this.selecionar(this.loteSelecionado);
                })
                .catch((response : any) => {
                    jQuery('#dialogExportResult').modal('show');
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                    this.editavel = true;
                    jQuery('#saidaExport').html('<span style="color: red;">'+this.aviso+"</span>");
                });
        }
	}

	exportarEstudantes() {
        if (!confirm("Deseja inserir os estudantes em todas as salas do lote selecionado?")) 
            return;
		this.erroAviso = false;
		this.aviso = '';
        jQuery('#dialogExportResult').modal('show');
        jQuery('#saidaExport').html("<i>Aguarde...<i>");
        this.editavel = false;
        //this.blockAutoRestore = true;
        this.loteSalasSimplificadoService.exportarEstudantes(this.loteSelecionado)
            .then((response : any) => {
                jQuery('#saidaExport').html(response);
                this.editavel = true;
            })
            .catch((response : any) => {
                this.erroAviso = true;
                this.aviso = this.erroHttp(response);
                this.editavel = true;
                jQuery('#saidaExport').html('<span style="color: red;">'+this.aviso+"</span>");
            });
        
    }

	ngOnInit() {
		this.macroService.getMacros()
			.then((response : any) => {
				this.superMacroService.listar()
					.then((response : any) => {
						this.servidoresMoodleService.getServidoresMoodle()
							.then((response : any) => {
								this.grupoLotesSimplificadosService.listar()
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
			})
			.catch((response : any) => {
				this.erroAviso = true;
				this.aviso = this.erroHttp(response);
				this.status = this.ERROR;
				alert(this.aviso);
			})
		
	}

}
