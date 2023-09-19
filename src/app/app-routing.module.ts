import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalasComponent } from './components/pages/salas/salas.component';
import { CriaSalasComponent } from './components/pages/salas/cria-salas/cria-salas.component';
import { SalasOldComponent } from './components/pages/salas-old/salas-old.component';
import { LoteSalasComponent } from './components/pages/lote-salas/lote-salas.component';
import { LoteSalasSimplificadoComponent } from './components/pages/lote-salas-simplificado/lote-salas-simplificado.component';
import { PeriodoLetivosComponent } from './components/pages/periodo-letivos/periodo-letivos.component';
import { PeriodoLetivosCategoriasComponent } from './components/pages/periodo-letivos-categorias/periodo-letivos-categorias.component';
import { PlDisciplinasAcademicosComponent } from './components/pages/pl-disciplinas-academicos/pl-disciplinas-academicos.component';
import { FaculdadesComponent } from './components/pages/faculdades/faculdades.component';
import { UsuariosComponent } from './components/pages/usuarios/usuarios.component';
import { ServidoresMoodleComponent } from './components/pages/servidores-moodle/servidores-moodle.component';
import { FormularioInsercaoUsuariosMoodleComponent } from './components/pages/servidores-moodle/formulario-insercao-usuarios-moodle/formulario-insercao-usuarios-moodle.component';
import { AgendaComponent } from './components/pages/agenda/agenda.component';
import { ReservasComponent } from './components/pages/reservas/reservas.component';
import { RecursoComponent } from './components/pages/recurso/recurso.component';
import { CalendarioComponent } from './components/pages/calendario/calendario.component';
import { MacroComponent } from './components/pages/macro/macro.component';
import { SuperMacroComponent } from './components/pages/super-macro/super-macro.component';
import { UnidadeOrganizacionalComponent } from './components/pages/unidade-organizacional/unidade-organizacional.component';
import { FormularioInsercaoUsuariosAdComponent } from './components/pages/unidade-organizacional/formulario-insercao-usuarios-ad/formulario-insercao-usuarios-ad.component';
import { FormularioAlteracaoUsuarioComponent } from './components/pages/unidade-organizacional/formulario-alteracao-usuario/formulario-alteracao-usuario.component';
import { FormularioPessoasEstatusLotacaoComponent } from './components/pages/usuarios/formulario-pessoas-estatus-lotacao/formulario-pessoas-estatus-lotacao.component';
import { LogsComponent } from './components/pages/logs/logs.component';
import { RolesComponent } from './components/pages/roles/roles.component';
import { LoginComponent } from './components/pages/login/login.component';
import { HomeComponent } from './components/pages/home/home.component';
import { usuarioNaoAutenticadoGuard } from './services/guards/usuario-nao-autenticado.guard';
import { usuarioAutenticadoGuard } from './services/guards/usuario-autenticado.guard';
import { sessionUserGuard } from './services/guards/session-user.guard';

const routes: Routes = [
      { 
        path:'', canActivate: [usuarioAutenticadoGuard],
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full'},
          { path: 'salas', component: SalasComponent },
          { path: 'salas/create', component: CriaSalasComponent },
          { path: 'salas/create/:periodoLetivoKey/:codigoCurso/:codigoDisciplina/:salaTurma', component: CriaSalasComponent },
          { path: 'salas-old', component: SalasOldComponent },
          { path: 'lote-salas', component: LoteSalasComponent },
          { path: 'lote-salas-simplificados', component: LoteSalasSimplificadoComponent },
          { path: 'periodo-letivos', component: PeriodoLetivosComponent },
          { path: 'periodo-letivos-categorias', component: PeriodoLetivosCategoriasComponent },
          { path: 'pl-disciplinas-academicos', component: PlDisciplinasAcademicosComponent},
          { path: 'faculdades', component: FaculdadesComponent },
          { path: 'usuarios', component: UsuariosComponent },
          { path: 'servidores-moodle', component: ServidoresMoodleComponent },
          { path: 'formulario-insere-usuarios', component: FormularioInsercaoUsuariosMoodleComponent },
          { path: 'agenda', component: AgendaComponent },
          { path: 'reservas', component: ReservasComponent },
          { path: 'recursos', component: RecursoComponent },
          { path: 'calendario', component: CalendarioComponent },
          { path: 'macro', component: MacroComponent },
          { path: 'super-macro', component: SuperMacroComponent },
          { path: 'unidade-organizacional', component: UnidadeOrganizacionalComponent },
          { path: 'formulario-insere-ad', component: FormularioInsercaoUsuariosAdComponent },
          { path: 'formulario-altera-usuario', component: FormularioAlteracaoUsuarioComponent },
          { path: 'formulario-pessoas-estatus-lotacao', component: FormularioPessoasEstatusLotacaoComponent },
          { path: 'logs', component: LogsComponent },
          { path: 'roles', component: RolesComponent },
          { path: 'home', component: HomeComponent },
        ]
    },
    
    { path: 'login', component: LoginComponent , canActivate: [usuarioNaoAutenticadoGuard]},
    { path: '**', component: LoginComponent, canActivate: [usuarioNaoAutenticadoGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
