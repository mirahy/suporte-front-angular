import { Component, OnInit } from '@angular/core';
import { AbstractComponentChild } from 'src/app/shared/components/abstract-component-child';
import { DadosService } from 'src/app/services/dados.service';
import { FaculdadeService } from 'src/app/services/faculdade.service';
import { Faculdade } from '../../../../models/faculdade';
import { MacroService } from 'src/app/services/macro.service';
import { PeriodoLetivosService } from 'src/app/services/periodo-letivos.service';
import { PeriodoLetivo } from '../../../../models/periodo-letivo';
import { PlDisciplinasAcademicosService } from 'src/app/services/pl-disciplinas-academicos.service';
import { PlDisciplinasAcademicos } from '../../pl-disciplinas-academicos/pl-disciplinas-academicos';
import { SalasService } from 'src/app/services/SalasService';
import { ServidoresMoodleService } from 'src/app/services/servidores-moodle.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../../../models/usuario';
import { Sala } from '../../../../models/sala';
declare var jQuery: any;

@Component({
    selector: 'app-sala-editor',
    templateUrl: './sala-editor.component.html',
    styleUrls: ['./sala-editor.component.less'], 
})
export class SalaEditorComponent extends AbstractComponentChild implements OnInit {

    constructor(private macroService: MacroService, private periodoLetivoService: PeriodoLetivosService,
        private servidoresMoodleService: ServidoresMoodleService, private salasService: SalasService,
        private dadosService:DadosService, private faculdadeService: FaculdadeService, private usuarioService:UsuarioService,
        private plDisciplinasAcademicosService:PlDisciplinasAcademicosService) {
        super();
    }

    salaProvao:Sala = Sala.geraNovaSala();;
    sala: Sala = Sala.geraNovaSala();;
    salas:Array<Sala> = [];
    sufixoNomeSala:string = "";

    faculdadeTemp = Faculdade.generateFaculdade();
    faculdadeSelecionadaId = "";
    disciplinaSelecionadaId = "";

    plDisciplinasAcademicosTemp: PlDisciplinasAcademicos = PlDisciplinasAcademicos.generatePlDisciplinasAcademicos();
    filteredDisciplina:any = [];

    usuarios: Array<Usuario> = [];
    filteredUsuarios:any = [];
    nome_professor_temp = "";

    STATUS_INICIAL_PADRAO = 'PROCESSO'
    
    get faculdades() {
        return this.faculdadeService.faculdades;
    }

    get macros() {
        return this.macroService.macros;
    }
    get modalidades() {
        return this.salasService.modalidades;
    }
    get objetivosSalas() {
        return this.salasService.objetivosSalas;
    }
    get plDisciplinasAcademicosList () : Array<PlDisciplinasAcademicos> {
        return this.plDisciplinasAcademicosService.plDisciplinasAcademicos;
    }
    get periodoLetivos () : Array<PeriodoLetivo> {
        return this.periodoLetivoService.periodoLetivos;
    }

    novaSala() {
        this.sala = Sala.geraNovaSala();
    }

    editar(sala:Sala, ) {

    }

    selecionaPeriodoLetivo () {
        if (this.sala.periodo_letivo_id) {
            this.sala.curso = "";
            this.sala.nome_sala = "";
        }
    }

    selecionaFaculdade() {
        if (this.faculdadeSelecionadaId) {
            this.faculdadeTemp = this.faculdadeService.faculdadesIndex.get(this.faculdadeSelecionadaId);
            this.sala.curso = "";
            this.disciplinaSelecionadaId = "";
            this.sala.nome_sala = "";
        }
    }

    selecionaCurso(resetSala = true) {
        if (this.sala.curso) {
            this.plDisciplinasAcademicosTemp = PlDisciplinasAcademicos.generatePlDisciplinasAcademicos();
            //this.sala.nome_sala = "";
            this.disciplinaSelecionadaId = "";
            this.editavel = false;
            this.plDisciplinasAcademicosService.getPlDisciplinasAcademicos(this.sala.periodo_letivo_id, this.sala.curso)
                .then(r => {
                    this.editavel = true;
                    this.filteredDisciplina = this.filterDisciplina("", this.plDisciplinasAcademicosList);
                    if (resetSala)
                        this.sala.nome_sala = "";
                    else {
                        var plda = this.plDisciplinasAcademicosService.plDisciplinasAcademicosNameIndex!.get(this.sala.nome_sala.replace(" " + this.sufixoNomeSala,""))
                        if (plda)
                            this.disciplinaSelecionadaId = plda.disciplina;
                    }
                }).catch(response => {
                    this.erroAviso = true;
                    this.aviso = this.erroHttp(response);
                    alert(this.aviso)
                    this.editavel = true;
                });
        }
    }

    buscaDisciplina(event:any) {
        this.filteredDisciplina = this.filterDisciplina(event.query, this.plDisciplinasAcademicosList);
    }
    buscaUsuario(event:any) {
        if (event.query.length > 1)
            this.filteredUsuarios = this.filterUsuario(event.query, this.usuarios);
        else
        this.filteredUsuarios = [];
    }
    selecionaUsuario(event:any) {
        var id = event.substring(0,event.indexOf(' - ')) ;
        console.log(id);
        this.sala.solicitante_id = id;
        this.nome_professor_temp = event.substring(event.indexOf(' - ')+3) ;
    }
    limpaUsuario(event:any) {
        this.sala.solicitante_id = "";
    }

    private filterDisciplina(query:any, plcs: PlDisciplinasAcademicos[]):any[] {
        let filtered : string[] = [];
        for(let i = 0; i < plcs.length; i++) {
            let plc = plcs[i];
            if (plc.disciplina.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(plc.disciplina);
            }
        }
        return filtered;
    }
    private filterUsuario(query:any, users: Usuario[]):any[] {
        let filtered : string[] = [];
        for(let i = 0; i < users.length; i++) {
            let u = users[i];
            if (u.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(u.id + " - " + u.name);
            }
        }
        return filtered;
    }
    selecionaDisciplina(value:any) {
        //console.log(this.plDisciplinasAcademicosService.plDisciplinasAcademicosNameIndex.get(value))
    }

    atualizarSala(){
        
    }

    ngOnInit() {
        this.dadosService.statusList()
            .then(response => {
                this.periodoLetivoService.getPeriodoLetivos()
                    .then(response => {
                        this.usuarioService.listaUsuariosCriaSala()
                            .then(response => {
                                this.usuarios = response;
                                this.faculdadeService.listar()
                                    .then(response => {
                                        this.macroService.getMacros()
                                            .then(response => {
                                                this.salasService.getObjetivosSalas()
                                                    .then(response => {
                                                        this.salasService.getModalidades()
                                                            .then(response => {
                                                                this.status = this.COMPLETE;
                                                                this.editavel = true;
                                                            })
                                                            .catch(response => {
                                                                this.status = this.ERROR;
                                                                console.log(response)
                                                            }) 
                                                    })
                                                    .catch(response => {
                                                        this.status = this.ERROR;
                                                        console.log(response)
                                                    })
                                            })
                                            .catch(response => {
                                                this.status = this.ERROR;
                                                console.log(response)
                                            })    
                                    })
                                    .catch(response => {
                                        this.status = this.ERROR;
                                        console.log(response)
                                    })
                            })
                            .catch(response => {
                                this.status = this.ERROR;
                                console.log(response)
                            })
                    })
                    .catch(response => {
                        this.status = this.ERROR;
                        console.log(response)
                    })
            })
            .catch(response => {
                this.status = this.ERROR;
                console.log(response)
            });
        
        this.salasService.getSufixoNomeSala()
            .then(response => {
                this.sufixoNomeSala = response;
            })
            .catch(response => {
                console.log(response)
            })
    }

}
