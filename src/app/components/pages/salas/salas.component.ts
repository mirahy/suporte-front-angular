import { Component, OnInit } from '@angular/core';
import { SalasService } from 'src/app/services/SalasService';
import { Sala } from '../../../models/sala';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { DadosService } from 'src/app/services/dados.service';
import { FaculdadeService } from 'src/app/services/faculdade.service';
import { Faculdade } from '../../../models/faculdade';
import { Estudante } from '../../../models/estudante';
import { PlDisciplinasAcademicos } from '../pl-disciplinas-academicos/pl-disciplinas-academicos';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PlDisciplinasAcademicosService } from 'src/app/services/pl-disciplinas-academicos.service';
import { PeriodoLetivosService } from 'src/app/services/periodo-letivos.service';
import { PeriodoLetivo } from '../../../models/periodo-letivo';
import { MacroService } from 'src/app/services/macro.service';
import { Status } from 'src/app/shared/status';
import { CursosService } from 'src/app/services/cursos.service';
declare var jQuery: any;


@Component({
  selector: 'app-salas',
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.less']
})
export class SalasComponent extends AbstractComponent implements OnInit {

  readonly STATUS_INICIAL_PADRAO = Status.CHAVES.PROCESSO;
  readonly STATUS_CONCLUIDO_PADRAO = Status.CHAVES.CONCLUIDO;
  readonly STATUS_REJEITADO_PADRAO = Status.CHAVES.REJEITADO;

  criteria: string = "";

  sala: Sala = Sala.geraNovaSala();

  statusTemp: string = "";
  tituloMensagem: string = "";
  mensagem: string = "";
  mostraMais = false;

  salaResp = Sala.geraNovaSala();
  emailResp = "";

  estudantes: Array<Estudante> = [];
  estudanteTemp: Estudante = new Estudante("", "", "", false);

  saidaRestore = "";
  blockAutoRestore = false;

  faculdadeTemp = Faculdade.generateFaculdade();
  faculdadeSelecionadaId = "";
  disciplinaSelecionadaId = "";

  plDisciplinasAcademicosTemp: PlDisciplinasAcademicos = PlDisciplinasAcademicos.generatePlDisciplinasAcademicos();
  filteredDisciplina:any = [];

  usuarios: Array<Usuario> = [];
  filteredUsuarios:any = [];
  nome_professor_temp = "";
  nome_sala_moodle = "";
  professor_sala_moodle = "";

  sufixoNomeSala = "";

  courseImportId = "";

  permissao = "";
  toDisplay = false;
  mensagemDialog: any;

  constructor(private salasService: SalasService, private dadosService: DadosService, private faculdadeService: FaculdadeService, private periodoLetivoService: PeriodoLetivosService
    , private usuarioService: UsuarioService, private plDisciplinasAcademicosService: PlDisciplinasAcademicosService, private macroService: MacroService, private cursosService: CursosService) {
    super();
  }

  get salas(): Array<Sala>|any {
    return this.salasService.salas;
  }

  set salas(salas: Array<Sala>) {
    this.salasService.salas = salas;
  }

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
  get plDisciplinasAcademicosList(): Array<PlDisciplinasAcademicos> {
    return this.plDisciplinasAcademicosService.plDisciplinasAcademicos;
  }
  get periodoLetivos(): Array<PeriodoLetivo> {
    return this.periodoLetivoService.periodoLetivos;
  }

  eu() {
    return this;
  }

  editarVisualizar(sala:Sala, outrosDados = false) {
    this.sala = sala.clone();
    this.estudantes = Estudante.converteJSONParaEstudantes(this.sala.estudantes);
    this.faculdadeTemp = this.sala.curso ? this.sala.curso.faculdade : Faculdade.generateFaculdade();
    this.faculdadeSelecionadaId = this.faculdadeTemp.id ? this.sala.curso.faculdade.id : "";
    this.disciplinaSelecionadaId = "";
    this.nome_professor_temp = this.sala.nome_professor;
    this.sala.curso = this.sala.curso.id;
    this.getSalaMoodle();
    if (sala.status.chave == this.STATUS_INICIAL_PADRAO) {
      this.aviso = "";
      this.erroAviso = false;
      //window.location.href = '/salas/' + sala.id + '/edit';
    }
    else {
      this.aviso = this.sala.mensagem;
      this.erroAviso = sala.status.chave == this.STATUS_REJEITADO_PADRAO;
    }
    this.editavel = false;
    this.mostraMais = false;
    this.plDisciplinasAcademicosService.getPlDisciplinasAcademicos(this.sala.periodo_letivo_id, this.sala.curso)
      .then(r => {
        var plda = this.plDisciplinasAcademicosService.plDisciplinasAcademicosNameIndex!.get(this.sala.nome_sala)
        if (plda)
          this.disciplinaSelecionadaId = plda.disciplina;
        else
          this.disciplinaSelecionadaId = "";

        this.editavel = sala.status.chave == this.STATUS_INICIAL_PADRAO || outrosDados;
      }).catch(response => {
        this.erroAviso = true;
        this.aviso = this.erroHttp(response);
        alert(this.aviso)
        this.editavel = sala.status.chave == this.STATUS_INICIAL_PADRAO;
      });
    //window.location.href = ('/salas/' + sala.id + '/' + (sala.status.chave == STATUS_INICIAL_PADRAO ? 'edit' : ''));
  }

  preparaSetStatusSala(sala: Sala, isConcluido: boolean) {
    this.sala = sala;
    this.editavel = true;
    this.mensagem = "";
    if (isConcluido) {
      this.salasService.getMensagemSala(sala)
        .then(response => {
          this.mensagem = response;
        })
      this.statusTemp = this.STATUS_CONCLUIDO_PADRAO;
      this.tituloMensagem = "Informe o link da sala criada:"
    }
    else {
      this.statusTemp = this.STATUS_REJEITADO_PADRAO;
      this.tituloMensagem = "Informe uma justificativa para a rejeição:"
    }
  }

  statusSala() {
    this.editavel = false;
    this.salasService.statusSala(this.sala, this.statusTemp, this.mensagem)
      .then(response => {
        if (response) {
          alert(this.erroHttp(response))
          return;
        }
        if(!response){
          this.sala.mensagem = this.mensagem
        }
        jQuery('#dialogStatus').modal('hide');
      })
      .catch(response => {
        alert(this.erroHttp(response));
        jQuery('#dialogStatus').modal('hide');
      });
  }

  atualizarSala() {
    // removendo todos os espaços em branco
    let link = this.sala.link_backup_moodle ? this.sala.link_backup_moodle.replace(/\s+/g, '') : "";
    this.salasService.validaLinkMoodle(link)
      .then(response =>{
        let validaLink:any = response;
        let id:any = this.salasService.getIdLinkMoodle(link);
        if (validaLink['status'].value && id['status'].value) {
          this.sala.estudantes = Estudante.converteEstudantesParaJSON(this.estudantes);
          if (this.plDisciplinasAcademicosService.plDisciplinasAcademicosNameIndex!.get(this.sala.nome_sala.replace(" " + this.sufixoNomeSala, "")))
            this.salasService.aplicarPlDisciplina(this.sala, this.plDisciplinasAcademicosService.plDisciplinasAcademicosNameIndex!.get(this.sala.nome_sala.replace(" " + this.sufixoNomeSala, "")))
          else
            this.salasService.aplicarPlDisciplina(this.sala, PlDisciplinasAcademicos.generatePlDisciplinasAcademicos())
          this.salasService.atualizarSala(this.sala)
            .then(response => {
              if (response) {
                this.erroAviso = true;
                this.aviso = this.erroHttp(response);
              }
              else {
                this.erroAviso = false;
                this.aviso = "Sala Atualizada!";
                jQuery('#dialogSalas').modal('hide');
              }
            }).catch(response => {
              this.erroAviso = true;
              this.aviso = this.erroHttp(response);
            })
        }else {
          jQuery('#dialogMensagem').modal('hide');
            this.erroAviso = !validaLink['status'].value || !id['status'].value;
            this.aviso = validaLink['msg'] ? validaLink['msg'].value : "" ||  id['msg'] ? id['msg'].value : "";
        }
      }).catch(response => {
        this.erroAviso = true;
        this.aviso = this.erroHttp(response);
      })


  }

  adicionarEstudante() {
    if (this.estudanteTemp.isValid()) {
      this.estudantes.push(new Estudante(this.estudanteTemp.username, this.estudanteTemp.email, this.estudanteTemp.fullname, this.estudanteTemp.is_professor));
      jQuery('#dialogEstudante').modal('hide');
      this.estudanteTemp = new Estudante("", "", "", false);
    }
    else
      alert("Usuário Inválido!");
  }
  removerEstudante(estudante: Estudante) {
    if (!confirm("Deseja remover este estudante"))
      return;
    var i = 0;
    for (; i < this.estudantes.length; i++) {
      if (estudante.equals(this.estudantes[i]))
        break;
    }
    if (i < this.estudantes.length) {
      this.estudantes.splice(i, 1);
    }
  }
  limparEstudantes() {
    if (confirm("Deseja remover todos os estudantes"))
      this.estudantes = [];
  }
  lerAlunosCSV(event:any) {
    var fileExtension = /.*\.csv/;
    var fileTobeRead = event.target.files[0];
    if (fileTobeRead.name.toLowerCase().match(fileExtension)) {
      var fileReader = new FileReader();
      var _this = this;
      fileReader.onload = function (e) {
        _this.estudantes = Estudante.processaCSV(fileReader.result);
      }
      fileReader.readAsText(fileTobeRead);
    }
    else {
      alert("Por favor selecione arquivo csv");
    }

  }
  carregarEstudantes() {
    this.plDisciplinasAcademicosTemp = this.disciplinaSelecionadaId ? this.plDisciplinasAcademicosService.plDisciplinasAcademicosNameIndex!.get(this.disciplinaSelecionadaId) : null;
    if (this.plDisciplinasAcademicosTemp && confirm("Confirmar carregamento de lista de Estudantes?")) {
      this.editavel = false;
      this.plDisciplinasAcademicosService.getEstudantes(this.plDisciplinasAcademicosTemp.id, true)
        .then(est => {
          this.estudantes = est;
          this.plDisciplinasAcademicosTemp.estudantes = est;
          this.editavel = true;
          jQuery('#dialogBuscaEstudantes').modal('hide');
        }).catch(response => {
          this.erroAviso = true;
          this.aviso = this.erroHttp(response);
          alert(this.aviso)
          this.editavel = true;
        });
    }
  }
  carregarEstudantesSigecad() {
    this.plDisciplinasAcademicosTemp = this.disciplinaSelecionadaId ? this.plDisciplinasAcademicosService.plDisciplinasAcademicosNameIndex!.get(this.disciplinaSelecionadaId) : null;
    if (this.plDisciplinasAcademicosTemp && confirm("Confirmar carregamento de lista de Estudantes do SIGECAD?")) {
      this.editavel = false;
      //this.plDisciplinasAcademicosService.getAcademicosDisciplinasSigecad(this.plDisciplinasAcademicosTemp.disciplina_key,this.sala.periodo_letivo_id,this.plDisciplinasAcademicosTemp.turma_id, this.sala.id)
      this.plDisciplinasAcademicosService.getAcademicosDisciplinasSigecad(this.plDisciplinasAcademicosTemp.disciplina_key, this.sala.periodo_letivo_id, this.plDisciplinasAcademicosTemp.turma_id, this.plDisciplinasAcademicosTemp.turma_nome, this.sala.id)
        .then(est => {
          this.estudantes = est;
          this.plDisciplinasAcademicosTemp.estudantes = est;
          this.editavel = true;
          jQuery('#dialogBuscaEstudantesSigecad').modal('hide');
        }).catch(response => {
          this.erroAviso = true;
          this.aviso = this.erroHttp(response);
          alert(this.aviso)
          this.editavel = true;
        });
    }
  }
  preparaRestauracaoAutomatica(sala: Sala) {
    this.editarVisualizar(sala, true);
    this.erroAviso = false;
    jQuery('#saidaRestore').html('<div  style="text-align: center"><b>...</b></div>');
    let id:any = this.salasService.getIdLinkMoodle(this.sala.link_backup_moodle);
    this.courseImportId = id['id'].value;
    //this.editavel = true;
    this.blockAutoRestore = false;
  }
  executarRestauracaoAutomatica() {
    this.editavel = false;
    this.blockAutoRestore = true;
    this.salasService.executarRestauracaoAutomatica(this.sala, this.courseImportId)
      .then(response => {
        jQuery('#saidaRestore').html(response);
        this.editavel = true;
      })
      .catch(response => {
        this.erroAviso = true;
        this.aviso = this.erroHttp(response);
        this.editavel = true;
        jQuery('#saidaRestore').html('<span style="color: red;">' + this.aviso + "</span>");
      });
  }
  exportarEstudantesMoodle(sala:Sala) {
    if (!confirm('confirmar exportação de estudantes para sala?'))
      return;
    //jQuery('#dialogRestore').modal('show');
    //this.preparaRestauracaoAutomatica(sala);
    this.blockAutoRestore = true;
    this.salasService.exportarEstudantesMoodle(this.sala)
      .then(response => {
        jQuery('#saidaRestore').html(response);
        this.editavel = true;
      })
      .catch(response => {
        this.erroAviso = true;
        this.aviso = this.erroHttp(response);
        this.editavel = true;
        jQuery('#saidaRestore').html('<span style="color: red;">' + this.aviso + "</span>");
      });
  }

  selecionaPeriodoLetivo() {
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
            var plda = this.plDisciplinasAcademicosService.plDisciplinasAcademicosNameIndex!.get(this.sala.nome_sala.replace(" " + this.sufixoNomeSala, ""))
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
    var id = event.substring(0, event.indexOf(' - '));
    this.sala.solicitante_id = id;
    this.nome_professor_temp = event.substring(event.indexOf(' - ') + 3);
  }
  limpaUsuario(event:any) {
    this.sala.solicitante_id = "";
  }

  private filterDisciplina(query:string, plcs: PlDisciplinasAcademicos[]): any[] {
    let filtered: string[] = [];
    for (let i = 0; i < plcs.length; i++) {
      let plc = plcs[i];
      if (plc.disciplina.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(plc.disciplina);
      }
    }
    return filtered;
  }
  private filterUsuario(query:string, users: Usuario[]): any[] {
    let filtered: string[] = [];
    for (let i = 0; i < users.length; i++) {
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


  getSalaMoodle() {
    this.sala.status.chave == this.STATUS_INICIAL_PADRAO ? this.erroAviso = false : '';
    this.sala.status.chave == this.STATUS_INICIAL_PADRAO ? this.aviso = "" : '';
    this.nome_sala_moodle = "";
    this.professor_sala_moodle = "";
    this.toDisplay = true;
    // removendo todos os espaços em branco
    let link = this.sala.link_backup_moodle ? this.sala.link_backup_moodle.replace(/\s+/g, '') : "";
    this.salasService.validaLinkMoodle(link)
      .then(response =>{
        let validaLink:any = response;
        let id:any = this.salasService.getIdLinkMoodle(link);
          if (link !== "" && validaLink['status'].value && id['status'].value && this.sala.curso && this.sala.periodo_letivo_id) {
            this.salasService.getSalaMoodle(id['id'].value, this.sala)
              .then((r:any) => {
                var result = r.json()
                var salas = result.enrolledcourses;
                if (salas != null)
                  salas.forEach((element:any) => {
                    if (element.id == id['id'].value) {
                      this.nome_sala_moodle = element.fullname;
                    }
                  });
                this.professor_sala_moodle = result.fullname
                this.toDisplay = false;
              }).catch(response => {
                this.toDisplay = false;
                this.erroAviso = true;
                this.aviso = this.erroHttp(response);
                this.sala.status.chave == this.STATUS_INICIAL_PADRAO ? this.editavel = true : '';
              });
          } else {
            this.toDisplay = false;
            this.sala.status.chave == this.STATUS_INICIAL_PADRAO ? this.erroAviso = !validaLink['status'].value || !id['status'].value : '';
            this.sala.status.chave == this.STATUS_INICIAL_PADRAO ?
            this.aviso = validaLink['msg'] ? validaLink['msg'].value : "" ||  id['msg'] ? id['msg'].value : "" : '';
          }
      }).catch(response => {
        this.toDisplay = false;
        this.erroAviso = true;
        this.aviso = this.erroHttp(response);
        this.sala.status.chave == this.STATUS_INICIAL_PADRAO ? this.editavel = true : '';
      });

  }

  sendEmail(sala: Sala) {
    this.salasService.sendEmail(sala.id)
      .then(r => {
        let sala = r.json()
        console.log(sala)
        this.salaResp = sala.sala;
        this.salaResp.curso = this.cursosService.cursosIndex.get(sala.sala.curso_id);
        this.emailResp = sala.email;
        jQuery('#dialogCreate').modal('show');
      })
      .catch(response => {
        alert(this.erroHttp(response));
      });
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
                                    this.salasService.listar()
                                      .then(response => {
                                        this.status = this.COMPLETE;
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
              })
          })
          .catch(response => {
            this.status = this.ERROR;
            console.log(response)
          });

          this.permissao = this.usuarioService.permissao


    this.salasService.getSufixoNomeSala()
      .then(response => {
        this.sufixoNomeSala = response;
      })
      .catch(response => {
        console.log(response)
      })


    jQuery(".custom-file-input").on("change",  () => {
      var fileName = jQuery(this).val().split("\\").pop();
      jQuery(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
  }

  readonly TOOLTIP = '<b>Selecionar um Arquivo CSV: </b><br>'
    + 'importa um arquivo CSV que contêm os estudantes desta disciplina; o formato do arquivo deve seguir o seguinte padrão:<br>'
    + '<table>'
    + '<tr><td>username,email,fullname</td></tr>'
    + '<tr><td>11122233344,fulano.silva111@academico.ufgd.edu.br,Fulano da Silva</td></tr>'
    + '<tr><td>BeltranoOliveira,BeltranoOliveira@ufgd.edu.br,Beltrano dos Santos Oliveira</td></tr>'
    + '</table>'
    + '<br><br>'
    + '<b>Carregar da Base de Dados: </b><br>'
    + 'Importa os estudantes para esta sala de alguma disciplina que há cadastrada no banco de dados<br>';

}
