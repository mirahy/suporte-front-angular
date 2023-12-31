
export class GrupoLotesSimplificado {

    id: number;
    descricao:string|unknown;
    auto_export_estudantes:boolean|unknown;
    
	constructor(id:(number|any), descricao?:string|unknown, auto_export_estudantes?:boolean|unknown) {
        if (typeof id == "number") {
            this.id = id;
            this.descricao = descricao;
            this.auto_export_estudantes = auto_export_estudantes;
        }
        else {
            this.id = id['id'];
            this.descricao = id['descricao'];
            this.auto_export_estudantes = id['auto_export_estudantes'];
        }
    }

    getPost() {
        return {
            'id' : this.id,
            'descricao' : this.descricao,
            'auto_export_estudantes' : this.auto_export_estudantes ? true : false
        }
    }
    
    static generate () {
        return new GrupoLotesSimplificado(0, "", false);
    }

    static generateList(list:any) {
        var lotes:Array<GrupoLotesSimplificado> = [];
        for(var i = 0; i < list.length; i++) {
            var lote = new GrupoLotesSimplificado(list[i]);
            lotes.push(lote);
        }
        return lotes;
    }

    
    clone() {
        return new GrupoLotesSimplificado(this.id, this.descricao, this.auto_export_estudantes);
    }
}