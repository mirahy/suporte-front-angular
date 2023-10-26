import { Usuario } from './usuario';

export class Recurso {
    id:number|any;
    nome:string|any;
    descricao:string|any;

    gestores:Array<Usuario>

    constructor (id:number|object|any, nome?:string|any, descricao?:string|any) {
        if (typeof id == "object") {
            this.id = id['id'];
            this.nome = id['nome'];
            this.descricao = id['descricao'];
        }
        else {
            this.id = id;
            this.nome = nome;
            this.descricao = descricao;
        }
        this.gestores = [];
    }
}