import { AbstractComponentInterface } from "./abstract-component-interface";
import { PlDisciplinasAcademicos } from "src/app/components/pages/pl-disciplinas-academicos/pl-disciplinas-academicos";

export interface AbstractPLDAComponentInterface extends AbstractComponentInterface {

    plDisciplinasAcademicosTemp: PlDisciplinasAcademicos;
    plDisciplinasAcademicosTempList: Array<PlDisciplinasAcademicos>;
    modoLista:boolean;
    periodoLetivoSelecionadoId:any;
    cursoSelecionadoId: string;
    faculdadeSelecionadaId: string;
    disciplinaSelecionadaNome: string;
    disciplinaSelecionadaNomes:Array<string>;

}