export class ArrayIndexador<T> {

    private listaOrigin:Array<T> | any = [];
    private indices:any  = {};

    private chave:string = "id";

    public constructor(lista: Array<T> | any, chavePersonalizada?:string | any) {
        if (chavePersonalizada)
            this.chave = chavePersonalizada;
        for(var i = 0; i < lista.length; i++) {
            this.indices[lista[i][this.chave]] = i;
        }
        this.listaOrigin = lista;
    }

    public get(chave:any) {
        var ret = this.listaOrigin[this.indices[chave]];
        return ret ? ret : null;
    }

    public append(lista: Array<T> | any) {
        this.listaOrigin = this.listaOrigin.slice(0);
        this.listaOrigin = this.listaOrigin.concat(lista);
        for(var i = this.listaOrigin.length-lista.length; i < this.listaOrigin.length; i++) {
            this.indices[this.listaOrigin[i][this.chave]] = i;
        }
    }

    add(elem:any) {
        this.indices[elem[this.chave]] = this.listaOrigin.length;
        this.listaOrigin.push(elem);
    }

    /*update(elem) {
        this.listaOrigin[this.indices[elem[this.chave]]];
    }*/

    public remove(chave:any) {
        this.listaOrigin.splice(this.indices[chave],1);
        this.indices = {};
        for(var i = 0; i < this.listaOrigin.length; i++) {
            this.indices[this.listaOrigin[i][this.chave]] = i;
        }
    }
}