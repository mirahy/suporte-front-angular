import { Component, OnInit } from '@angular/core';
import { MacroService } from 'src/app/services/macro.service';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { Macro } from '../../../models/macro';
import { PeriodoLetivo } from '../../../models/periodo-letivo';
import { PeriodoLetivosService } from 'src/app/services/periodo-letivos.service';
import { ServidoresMoodleService } from 'src/app/services/servidores-moodle.service';
declare var jQuery: any;

@Component({
    selector: 'app-macro',
    templateUrl: './macro.component.html',
    styleUrls: ['./macro.component.less']
})
export class MacroComponent extends AbstractComponent implements OnInit {

    constructor(private macroService: MacroService, private periodoLetivosService:PeriodoLetivosService, private servidoresMoodleService: ServidoresMoodleService) {
        super();
    }

    periodoLetivoTempIndex:number|string = 0;

    linksMoodles = [];

    get files() {
        return this.macroService.files;
    }
    set files(files) {
        this.macroService.files = files;
    }
    get macros() {
        return this.macroService.macros;
    }
    get macroSelecionada(): Macro {
        return this.macroService.macroSelecionada;
    }
    set macroSelecionada(macro: Macro) {
        this.macroService.macroSelecionada = macro;
    }
    get entradas() {
        return this.macroService.ENTRADAS;
    }
    get periodoLetivos() { 
        return this.periodoLetivosService.periodoLetivos;
    }

    get eu() {
        return this;
    }


    criarAlterarMacro() {
        var posSelecionar = this.macroSelecionada.id ? this.macroService.macrosIndex[this.macroSelecionada.id] : this.macroService.macros.length;
        this.macroService.criarAlterarMacro ()
            .then((response : any) => {
                this.macroService.getMacros()
                    .then((response : any) => {
                        this.selecionarMacro(this.macroService.macros[posSelecionar]);
                        jQuery('#dialogCriar').modal('hide');
                    })
                    .catch((r : any) => {
                        alert(this.erroHttp(r));
                    });
            })
            .catch((r : any) => {
                alert(this.erroHttp(r));
            });
    }

    aplicarPeriodoLetivo() {
        this.macroSelecionada.periodo_letivo = this.periodoLetivosService.periodoLetivos[this.periodoLetivosService.periodoLetivosIndex[this.periodoLetivoTempIndex]];
    }

    delMacro(macro: Macro) {
        if (confirm ("Confirmar exclusão da macro '"+macro.nome+"'?"))
            this.macroService.delMacro(macro.id)
                .then ((response : any) => {
                    this.macroService.getMacros()
                })
                .catch((r : any) => {
                    alert(this.erroHttp(r));
                });
    }
    
    selecionarMacro(macro: Macro|any) {
        if (macro == null){
            this.macroService.resetMacroSelecionada();
            this.periodoLetivoTempIndex = 0;
        }
        else {
            this.macroSelecionada = macro.clone();
            this.editavel = false;
            this.periodoLetivoTempIndex = (<PeriodoLetivo>this.macroSelecionada.periodo_letivo).id;
            this.macroService.getBuscadores()
                .then ((response : any) => {
                    this.editavel = true;
                })
                .catch((r : any) => {
                    alert(this.erroHttp(r));
                });
        }
    }

    ngOnInit() {
        this.editavel = true;
        this.carregarLista();

    }

    carregarLista(): Promise<any> {
        return this.macroService.getEntradasBuscadores()
            .then((response : any) => {
                this.macroService.getListFiles()
                    .then((response : any) => {
                        this.periodoLetivosService.getPeriodoLetivos()
                            .then((response : any) => {
                                this.servidoresMoodleService.getLinksServidoresMoodle()
                                    .then((response : any) => {
                                        this.linksMoodles = response;
                                        this.macroService.getMacros()
                                            .then((response : any) => {
                                                this.status = this.COMPLETE;
                                                return response;
                                            })
                                            .catch((r : any) => {
                                                alert(this.erroHttp(r));
                                            });
                                    })
                                    .catch((r : any) => {
                                        alert(this.erroHttp(r));
                                    });
                            })
                            .catch((r : any) => {
                                alert(this.erroHttp(r));
                            });
                       
                    })
                    .catch((r : any) => {
                        alert(this.erroHttp(r));
                    });
            })
            .catch((r : any) => {
                alert(this.erroHttp(r));
            });


    }

}
