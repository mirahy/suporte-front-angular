import { Injectable } from '@angular/core';
import { ArrayIndexador } from './array-indexador';
import { MacroService } from './macro.service';
import { PeriodoLetivosService } from './periodo-letivos.service';
import { SuperMacro } from './super-macro/super-macro';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SuperMacroService {

    superMacros:Array<SuperMacro> = [];
    superMacrosIndex: ArrayIndexador<SuperMacro> | undefined;
    superMacroSelecionada: SuperMacro = SuperMacro.generate();
    constructor(private http: HttpClient, private periodoLetivosService: PeriodoLetivosService, private macroService: MacroService) { }

    listar() {
        return this.http.get("/super-macro/all")
            .toPromise()
            .then((response:any) => {
                this.superMacros = SuperMacro.generateListPlus(response.json(), this.macroService.macros, this.macroService.macrosIndex);
                this.superMacrosIndex = new ArrayIndexador<SuperMacro>(this.superMacros);
                return this.superMacros;
            });
    }

    private getPostSuperMacro(superMacro:SuperMacro) {console.log(superMacro)
        var macro_padrao_id = superMacro.macro_padrao;
        if (superMacro.macro_padrao && typeof superMacro.macro_padrao == 'object')
            macro_padrao_id = superMacro.macro_padrao.id;
        return {
            id: superMacro.id,
            descricao: superMacro.descricao,
            macro_padrao_id : macro_padrao_id
        }
    }

    create(superMacro:SuperMacro) {
        return this.http.post("/super-macro",this.getPostSuperMacro(superMacro))
            .toPromise()
            .then(response => {
                return this.listar();
            });
    }
    update(superMacro:SuperMacro) {
        return this.http.put("/super-macro/"+superMacro.id,this.getPostSuperMacro(superMacro))
            .toPromise()
            .then(response => {
                return this.listar();
            });
    }
    delete(superMacro:SuperMacro) {
        return this.http.delete("/super-macro/"+superMacro.id)
            .toPromise()
            .then(response => {
                return this.listar();
            });
    }

}
