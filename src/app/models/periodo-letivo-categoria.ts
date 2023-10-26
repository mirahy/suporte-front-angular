import { Curso } from './curso';
import { PeriodoLetivo } from './periodo-letivo';

export class PeriodoLetivoCategoria {
    id: number;
    curso:Curso|number|unknown;
    periodo_letivo:PeriodoLetivo|number|unknown;
    categoria_id:number|unknown;
    
    constructor(id:(number|any), curso?:Curso|number|unknown, periodo_letivo?:PeriodoLetivo|number|unknown,categoria_id?:number|unknown) {
        if (typeof id == "number") {
            this.id = id;
            this.curso = curso;
            this.periodo_letivo = periodo_letivo;
            this.categoria_id = categoria_id;
        }
        else {
            this.id = parseInt(id['id']);
            this.curso = id['curso_id'];
            this.periodo_letivo = id['periodo_letivo_id'];
            this.categoria_id = id['categoria_id'];
        }
    }
    
    static generateList(list:any):Array<PeriodoLetivoCategoria> {
        var periodoLetivoCategorias:Array<PeriodoLetivoCategoria> = [];
        for(var i = 0; i < list.length; i++) {
            var per = new PeriodoLetivoCategoria(list[i]);
            periodoLetivoCategorias.push(per);
        }
        return periodoLetivoCategorias;
    }
    
    clone() {
        return new PeriodoLetivoCategoria(this.id, this.curso, this.periodo_letivo, this.categoria_id);
    }
}