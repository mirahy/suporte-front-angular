import { Component, OnInit } from '@angular/core';
import { MacroService } from 'src/app/services/macro.service';
import { AbstractComponentChild } from 'src/app/shared/components/abstract-component-child';
import { Arquivo } from '../../../models/arquivo';
import { MacroComponent } from '../macro/macro.component';

@Component({
    selector: 'app-arquivo',
    templateUrl: './arquivo.component.html',
    inputs: ['ancestral'],
    styleUrls: ['./arquivo.component.less']
})
export class ArquivoComponent extends AbstractComponentChild implements OnInit {

    val2: string = 'Option 2';
    //arquivoSelecionado:string = "";

    constructor(private macroService: MacroService) {
        super();
    }

    get editavelChild () {
        return this.editavel && this.macroService.macroSelecionada.id > 0;
    }

    get nomeMacro () {
        return this.macroService.macroSelecionada.nome;
    }

    set nomeMacro (nome) {
        this.macroService.macroSelecionada.nome = nome;
    }

    get files() {
        return this.macroService.files;
    }
    set files(files:any) {
        this.macroService.files = files;
    }

    get arquivoSelecionadoRadio () {
        return this.macroService.macroSelecionada.arquivo ? this.macroService.macroSelecionada.arquivo.name : null;
    }
    set arquivoSelecionadoRadio (arquivo) {
        this.macroService.macroSelecionada.arquivo.name = arquivo
    }

    changeArquivo(arquivo:Arquivo) {
        if (this.editavelChild) {
            this.macroService.changeArquivo(arquivo.name)
                .then (r => {
                    this.macroService.macroSelecionada.arquivo = arquivo;
                })
                .catch(r => {
                    this.erroHttp(r);
                })
        }
        
        //this.macroService.macroSelecionada.arquivo = arquivo
    }

    onFileUpload(event : any) {
        this.macroService.onFileUpload(event)
            .then((nomeArquivo:any) => {
                if (this.ancestral instanceof MacroComponent) {
                    return (<MacroComponent> this.ancestral).carregarLista()
                        .then(r => {
                            var novoArquivo : Arquivo = this.macroService.files[this.macroService.filesIndex[nomeArquivo]];
                            this.macroService.macroSelecionada.arquivo = novoArquivo;
                            return nomeArquivo;
                        })
                        .catch(r => {
                            this.erroHttp(r);
                            return 0;
                        })
                }
                return 0;
            })
            .catch((r:any) => {
                this.erroHttp(r);
            })
          
    }

    ngOnInit() {
        //this.arquivoSelecionado = this.macroService.macroSelecionada.arquivo ? this.macroService.macroSelecionada.arquivo.name : null;
    }

}
