import { ArrayIndexador } from 'src/app/shared/array-indexador';
import { Curso } from './curso';
import { Faculdade } from './faculdade';
import { PeriodoLetivo } from './periodo-letivo';
import { Sala } from './sala';

export class LoteSalas {
    id: number;
    descricao: string|any;
    periodo_letivo: PeriodoLetivo|number|any;
    faculdade: Faculdade|number|any;
    curso: Curso|number|any;
    is_salas_criadas: boolean|any;
    is_estudantes_inseridos: boolean|any;
    
    salas: Array<Sala> = [];

	constructor(id:(number|any), descricao?:string|unknown, periodo_letivo?:PeriodoLetivo|number|unknown, faculdade?:Faculdade|number|unknown, curso?: Curso|number|unknown, is_salas_criadas?: boolean|unknown, is_estudantes_inseridos? :boolean|unknown) {
        if (typeof id == "number") {
            this.id = id;
            this.descricao = descricao;
            this.periodo_letivo = periodo_letivo;
            this.faculdade = faculdade;
            this.curso = curso;
            this.is_salas_criadas = is_salas_criadas;
            this.is_estudantes_inseridos = is_estudantes_inseridos;
        }
        else {
            this.id = parseInt(id['id']);
            this.descricao = id['descricao'];
            this.periodo_letivo = id['periodo_letivo_id'];
            this.faculdade = id['faculdade_id'];
            this.curso = id['curso_id'];
            this.is_salas_criadas = id['is_salas_criadas'] ? (eval (id['is_salas_criadas']) ? true : false ) : false;
            this.is_estudantes_inseridos = id['is_estudantes_inseridos'] ? (eval (id['is_estudantes_inseridos']) ? true : false ) : false;
        }
    }
    
    static generateList(list:any, faculdade?:Faculdade) {
        var loteSalasList:Array<LoteSalas> = [];
        for(var i = 0; i < list.length; i++) {
            var loteSalas = new LoteSalas(list[i]);
            //if (faculdade)
                //loteSalas.faculdade = faculdade;
            loteSalasList.push(loteSalas);
        }
        return loteSalasList;
    }

    static generateListPlus(list:any, periodoLetivoIndex:ArrayIndexador<PeriodoLetivo>, faculdadeIndex:ArrayIndexador<Faculdade>, cursoIndex:ArrayIndexador<Curso>) {
        var loteSalasList:Array<LoteSalas> = [];
        for(var i = 0; i < list.length; i++) {
            loteSalasList.push(LoteSalas.generate(list[i], periodoLetivoIndex, faculdadeIndex, cursoIndex));
        }
        return loteSalasList;
    }

    static generate(dados?:any,  periodoLetivoIndex?:ArrayIndexador<PeriodoLetivo>, faculdadeIndex?:ArrayIndexador<Faculdade>, cursoIndex?:ArrayIndexador<Curso>) {
        if (dados && periodoLetivoIndex && faculdadeIndex && cursoIndex) {
            var loteSalas = new LoteSalas(dados);
            loteSalas.periodo_letivo = periodoLetivoIndex.get(loteSalas.periodo_letivo);
            loteSalas.faculdade = faculdadeIndex.get(loteSalas.faculdade);
            loteSalas.curso = cursoIndex.get(loteSalas.curso);
            return loteSalas;
        }
        else
            return new LoteSalas(0,'',0,0,0,false,false);
    }
    
    clone() {
        return new LoteSalas(this.id, this.descricao, this.periodo_letivo, this.faculdade, this.curso, this.is_salas_criadas, this.is_estudantes_inseridos);
    }
}