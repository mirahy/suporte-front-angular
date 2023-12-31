import { Component, OnInit, ViewChild } from '@angular/core';
import { Estudante } from '../../../models/estudante';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { PeriodoLetivosService } from 'src/app/services/periodo-letivos.service';
import { FaculdadeService } from 'src/app/services/faculdade.service';
import { CursosService } from 'src/app/services/cursos.service';
import { PlDisciplinasAcademicosService } from 'src/app/services/pl-disciplinas-academicos.service';
import { Faculdade } from '../../../models/faculdade';
import { PlDisciplinasAcademicos } from './pl-disciplinas-academicos';
import { FileUpload } from 'primeng/fileupload';
declare var jQuery: any;

@Component({
    selector: 'app-pl-disciplinas-academicos',
    templateUrl: './pl-disciplinas-academicos.component.html',
    styleUrls: ['./pl-disciplinas-academicos.component.less']
})
export class PlDisciplinasAcademicosComponent extends AbstractComponent implements OnInit {

    constructor(private periodoLetivosService:PeriodoLetivosService, private plDisciplinasAcademicosService:PlDisciplinasAcademicosService, 
        private faculdadeService:FaculdadeService, private cursosService:CursosService) {
        super();
    }

    estudantes:Array<Estudante> = [];
    estudanteTemp: Estudante = Estudante.generateEstudante();
    plDisciplinasAcademicosTemp: PlDisciplinasAcademicos = PlDisciplinasAcademicos.generatePlDisciplinasAcademicos();
    faculdadeTemp = Faculdade.generateFaculdade();
    nomeDisciplinaTemp = "";
    cursoSelecionadoId = "";
    faculdadeSelecionadaId = "";
    periodoLetivoSelecionadoId = "";
    disciplinaSelecionadaId = "";
    disciplinaKeyTemp:any = "";

    readonly TIPOS_IMPORT_FILTRO = [
        {key: "UPLOAD", nome: "Upload de Arquivo"},
        {key: "CURSOS_SIGECAD", nome: "Cursos do SIGECAD"},
        //{key: "DISCIPLINAS_SIGECAD", nome: "Disciplinas do SIGECAD"},
    ]
    tipoImportFiltro = "";

    fileTemp:any = null;
    @ViewChild('uploador')
    uploador!: FileUpload;

    get periodoLetivos() {
        return this.periodoLetivosService.periodoLetivos;
    }
    get faculdades() {
        return this.faculdadeService.faculdades;
    }
    get plDisciplinasAcademicos () :Array<PlDisciplinasAcademicos>{
        return this.plDisciplinasAcademicosService.plDisciplinasAcademicos;
    }

    selecionaPeriodoLetivo(){
        if (this.periodoLetivoSelecionadoId) {
            this.faculdadeTemp = Faculdade.generateFaculdade();
            this.faculdadeSelecionadaId = "";
            this.cursoSelecionadoId = "";
            this.disciplinaSelecionadaId = "";
            this.plDisciplinasAcademicosTemp = PlDisciplinasAcademicos.generatePlDisciplinasAcademicos();
            this.nomeDisciplinaTemp = "";
        }
    }
    selecionaFaculdade() {
        if (this.faculdadeSelecionadaId) {
            this.faculdadeTemp = this.faculdadeService.faculdadesIndex.get(this.faculdadeSelecionadaId);
            this.cursoSelecionadoId = "";
            this.disciplinaSelecionadaId = "";
            this.plDisciplinasAcademicosTemp = PlDisciplinasAcademicos.generatePlDisciplinasAcademicos();
            this.nomeDisciplinaTemp = "";
        }
    }
    selecionaCurso() {
        if (this.cursoSelecionadoId) {
            this.disciplinaSelecionadaId = "";
            this.plDisciplinasAcademicosTemp = PlDisciplinasAcademicos.generatePlDisciplinasAcademicos();
            this.nomeDisciplinaTemp = "";
            this.editavel = false;
            this.plDisciplinasAcademicosService.getPlDisciplinasAcademicos(this.periodoLetivoSelecionadoId, this.cursoSelecionadoId, this.cursosService.cursosKeyIndex, this.periodoLetivosService.periodoLetivosNameIndex)
                .then((r : any) => {
                    this.editavel = true;
                }).catch((response : any) => {
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                    alert(this.aviso)
                    this.editavel = true;
                });
        }
    }
    selecionaDisciplina() {
        if (this.disciplinaSelecionadaId) {
            this.plDisciplinasAcademicosTemp = this.plDisciplinasAcademicosService.plDisciplinasAcademicosIndex!.get(this.disciplinaSelecionadaId);
            this.editavel = false;
            this.plDisciplinasAcademicosService.getEstudantes(this.disciplinaSelecionadaId, false)
                .then(est => {
                    this.estudantes = est;
                    this.plDisciplinasAcademicosTemp.estudantes = est;
                    this.editavel = true;
                }).catch(response => {
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                    alert(this.aviso)
                    this.editavel = true;
                });
        }
    }

    preparaCriaAlteraDisciplina() {
        this.nomeDisciplinaTemp = this.disciplinaSelecionadaId ? this.plDisciplinasAcademicosTemp.disciplina : "";
        this.disciplinaKeyTemp = this.disciplinaSelecionadaId ? this.plDisciplinasAcademicosTemp.disciplina_key : "";
    }

    adicionarAlterarDisciplina() {
        if (!this.nomeDisciplinaTemp) {
            alert("Informe um nome para a Disciplina!");
            return;
        }
        this.editavel = false;
        var plc = new PlDisciplinasAcademicos(this.disciplinaSelecionadaId == '' ? 0 : parseInt(this.disciplinaSelecionadaId), parseInt(this.cursoSelecionadoId),parseInt(this.periodoLetivoSelecionadoId),this.nomeDisciplinaTemp,[],this.disciplinaKeyTemp);
        
        this.plDisciplinasAcademicosService.criarAlterarDisciplina(plc)
            .then((r : any) => {
                if (this.disciplinaSelecionadaId == '')
                    this.estudantes = [];
                this.plDisciplinasAcademicosTemp.id = r;
                this.plDisciplinasAcademicosTemp.disciplina = this.nomeDisciplinaTemp;
                this.plDisciplinasAcademicosTemp.disciplina_key = this.disciplinaKeyTemp;
                this.disciplinaSelecionadaId = r;
                jQuery('#dialogDisciplina').modal('hide');
                this.editavel = true;
            }).catch((response : any) => {
                this.erroAviso = true;
                this.aviso = this.erroHttp(response);
                alert(this.aviso)
                this.editavel = true;
            });
    }

    removerDisciplina() {
        if (confirm("Confirmar remoção desta Disciplina?")) {
            this.editavel = false;
            this.plDisciplinasAcademicosService.removeDisciplina(this.disciplinaSelecionadaId)
                .then((r : any) => {
                    this.disciplinaSelecionadaId = '';
                    jQuery('#dialogDisciplina').modal('hide');
                    this.editavel = true;
                }).catch((response : any) => {
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                    alert(this.aviso)
                    this.editavel = true;
                });
        }
    }
    
    adicionarEstudante() {
        if (this.estudanteTemp.isValid()) {
            var estudantesParam = this.estudantes.slice(0);
            estudantesParam.push(new Estudante (this.estudanteTemp.username, this.estudanteTemp.email, this.estudanteTemp.fullname, this.estudanteTemp.is_professor));
            jQuery('#dialogEstudante').modal('hide');
            this.estudanteTemp = Estudante.generateEstudante();
            this.setEstudantes(estudantesParam);
        }
        else 
            alert ("Usuário Inválido!");
    }
    removerEstudante(estudante:Estudante) {
        if (!confirm ("Deseja remover este estudante")) 
            return;
        var estudantesParam = this.estudantes.slice(0);
        var i = 0;
        for (; i < estudantesParam.length; i++) {
            if (estudante.equals (estudantesParam[i]))
                break;
        }
        if (i < estudantesParam.length) {
            estudantesParam.splice (i, 1);
            this.setEstudantes(estudantesParam);
        }
    }
    limparEstudantes() {
        if (confirm ("Deseja remover todos os estudantes")){
            var estudantesParam = this.estudantes.slice(0);
            estudantesParam = [];
            this.setEstudantes(estudantesParam);
        }
    }
    private setEstudantes(estudantesParam:Array<Estudante>){
        this.editavel = false;
        this.plDisciplinasAcademicosService.setEstudantes(this.disciplinaSelecionadaId, estudantesParam)
                .then(est => {
                    this.estudantes = est;
                    this.plDisciplinasAcademicosTemp.estudantes = est;
                    this.editavel = true;
                }).catch(response => {
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                    alert(this.aviso)
                    this.editavel = true;
                });
    }

    preparaDialogImportacao() {
        //this.uploador.clear();
        this.tipoImportFiltro = "";
        this.erroAviso = false;
        this.aviso = "";
    }
    onSelectFile() {
        if (this.uploador.files.length > 0)
            this.fileTemp = this.uploador.files[0];
    }

    onCancelFile() {
        this.fileTemp = null;
    }

    uploadArquivoEstudantes() {
        if (confirm ("Esta ação irá substituir todos os atuais dados de Estudantes neste Período Letivo,\ndeseja confirmar?")) {
            this.editavel = false;
            this.plDisciplinasAcademicosService.uploadFileEstudantes(this.periodoLetivoSelecionadoId, this.fileTemp)! 
                .then((r : any) => {
                    this.editavel = true;
                    this.selecionaPeriodoLetivo();
                    alert("Upload Completo!");
                    jQuery('#dialogImportacao').modal('hide');
                }).catch((response : any) => {
                    this.editavel = true;
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                });
        }
    }

    importarCursosSigecad() {
        this.editavel = false;
        if (confirm("Deseja Importar os Cursos do SIGECAD deste Período Letivo?")) {
            this.plDisciplinasAcademicosService.getCursosSigecad(this.periodoLetivoSelecionadoId)
                .then((r : any) => {
                    this.faculdadeService.listar()
                        .then((response : any) => {
                            this.editavel = true;
                            this.selecionaPeriodoLetivo();
                            alert("Importação Concluída!");
                            jQuery('#dialogImportacao').modal('hide');
                        })
                        .catch((response : any) => {
                            this.erroAviso = true;
                            this.aviso = this.erroHttp(response);
                            this.status = this.ERROR;
                            alert(this.aviso);
                        })
                    
                }).catch((response : any) => {
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                    alert(this.aviso)
                    this.editavel = true;
                });
        }
        
    }

    importarDisciplinasSigecad() {
        
    }

    ngOnInit() {
        this.faculdadeService.listar()
            .then((response : any) => {
                this.periodoLetivosService.getPeriodoLetivos()
                    .then(r => {
                        this.status = this.COMPLETE;
                        this.editavel = true;
                    }).catch((response : any) => {
                        this.erroAviso = true;
                        this.aviso = this.erroHttp(response);
                        this.status = this.ERROR;
                        alert(this.aviso);
                    });
            })
            .catch((response : any) => {
                this.erroAviso = true;
                this.aviso = this.erroHttp(response);
                this.status = this.ERROR;
                alert(this.aviso);
            })
    }
}
