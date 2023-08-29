import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Arquivo } from '../components/pages/arquivo/arquivo';
import { Macro } from '../components/pages/macro/macro';
import { Buscador } from '../components/pages/buscadores/buscador';
import { PeriodoLetivo } from '../components/pages/periodo-letivos/periodo-letivo';
import { PeriodoLetivosService } from './periodo-letivos.service';

@Injectable()
export class MacroService {

    ENTRADAS:Array<string> = []

    macroSelecionada:Macro|any;

    files:Array<Arquivo> = [];
    filesIndex: {}|any = {};
    macros:Array<Macro> = [];
    macrosIndex: {}|any = {};

    constructor(private http:HttpClient, private periodoLetivosService:PeriodoLetivosService) { 
        this.resetMacroSelecionada();
    }

    resetMacroSelecionada() {
        this.macroSelecionada = new Macro(0,"",null,null,null,[]);
    }

    getListFiles() {
        return this.http.get("/files").toPromise()
            .then((response:any) => {
                var files = response.json();
                this.files = [];
                this.filesIndex = {};
                for (var i in files) {
                    var a = new Arquivo(files[i]);
                    this.files.push (a)
                    this.filesIndex[a.name] = i;
                }
                return this.files;
            });
    }

    getMacros() {
        return this.http.get("/macro/all").toPromise()
            .then((response: any) => {
                var macros = response.json();
                this.macros = [];
                this.macrosIndex = {};
                for (var i in macros) {
                    if (macros[i].arquivo)
                        macros[i].arquivo = this.files[this.filesIndex[macros[i].arquivo]];
                    macros[i].periodo_letivo_id = this.periodoLetivosService.periodoLetivos[this.periodoLetivosService.periodoLetivosIndex[<number>macros[i].periodo_letivo_id]];
                    var macro = new Macro (macros[i]);
                    this.macros.push (macro);
                    this.macrosIndex[macro.id] = i;
                }
                return this.macros;
            });
    }

    criarAlterarMacro () {
        return this.http.post ("/macro/name",{'nome' : this.macroSelecionada.nome, 'id': this.macroSelecionada.id, 'link_servidor_moodle': this.macroSelecionada.link_servidor_moodle, 'periodo_letivo_id': (this.macroSelecionada.periodo_letivo ? (<PeriodoLetivo>this.macroSelecionada.periodo_letivo).id : '')}).toPromise () 
    }

    delMacro(macroId: string | number) {
        return this.http.delete("/macro/"+ macroId).toPromise () 
            
    }

    addBuscador(buscador:Buscador) {
        return this.http.put ("/macro/"+this.macroSelecionada.id+"/buscador", buscador).toPromise()
    }
    delBuscador(buscador:Buscador) {
        return this.http.delete ("/macro/buscador/"+buscador.id).toPromise()
    }

    getEntradasBuscadores() {
        return this.http.get("/macro/entradas").toPromise()
            .then((response: any) => {
                this.ENTRADAS = response.json();
                return this.ENTRADAS;
            });
    }

    getBuscadores () {
        return this.http.get ("/macro/"+this.macroSelecionada.id+"/buscador").toPromise()
            .then ((response:any) => {
                var buscadores = response.json();
                this.macroSelecionada.buscadores = [];
                for(var i in buscadores) {
                    this.macroSelecionada.buscadores.push(new Buscador(buscadores[i]));
                }
            });
        
    }

    onFileUpload(data: { files: File }|any): Promise<string> | any{
        const formData: FormData = new FormData();
        const file = data.files[0];
        if (file) {
            formData.append('arquivo', file, file.name);
            formData.append('macroId', "" + this.macroSelecionada.id);
            return this.http.post("/macro/file", formData).toPromise()
                .then((r:any) => {
                    return r.json();
                });
        }

        return null;
    }

    changeArquivo(nomeFile: string) : Promise<Macro> {
        return this.http.post("macro/mudararquivo", {"nomeFile": nomeFile, "macroId": this.macroSelecionada.id}).toPromise()
            .then((response:any) => {
                var macroAlterada = response.json()
                macroAlterada.arquivo = this.files[this.filesIndex[macroAlterada.arquivo]];
                macroAlterada.periodo_letivo_id = this.periodoLetivosService.periodoLetivos[this.periodoLetivosService.periodoLetivosIndex[<number>macroAlterada.periodo_letivo_id]];
                var macro = new Macro (macroAlterada);
                if (macro.id) {
                    this.macros[this.macrosIndex[macro.id]] = macro;
                }
                return macro;
            })
    }
}
