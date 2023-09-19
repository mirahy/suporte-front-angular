import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalasComponent } from './components/pages/salas/salas.component';
import { UsuariosComponent } from './components/pages/usuarios/usuarios.component';
import { AgendaComponent } from './components/pages/agenda/agenda.component';
import { PeriodoLetivosComponent } from './components/pages/periodo-letivos/periodo-letivos.component';
import { FaculdadesComponent } from './components/pages/faculdades/faculdades.component';
import { CursosComponent } from './components/pages/cursos/cursos.component';
import { PeriodoLetivosCategoriasComponent } from './components/pages/periodo-letivos-categorias/periodo-letivos-categorias.component';
import { CriaSalasComponent } from './components/pages/salas/cria-salas/cria-salas.component';
import { SelectUsuarioComponent } from './components/pages/select-usuario/select-usuario.component';
import { BuscadoresComponent } from './components/pages/buscadores/buscadores.component';
import { ArquivoComponent } from './components/pages/arquivo/arquivo.component';
import { ReservasComponent } from './components/pages/reservas/reservas.component';
import { RecursoComponent } from './components/pages/recurso/recurso.component';
import { CalendarioComponent } from './components/pages/calendario/calendario.component';
import { MacroComponent } from './components/pages/macro/macro.component';
import { SalasOldComponent } from './components/pages/salas-old/salas-old.component';
import { PlDisciplinasAcademicosComponent } from './components/pages/pl-disciplinas-academicos/pl-disciplinas-academicos.component';

import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { FullCalendarModule } from '@fullcalendar/angular'; // from <p-fullCalendar></p-fullCalendar> to <full-calendar></full-calendar>
import { ColorPickerModule } from 'primeng/colorpicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';

import { UsuarioService } from './services/usuario.service';
import { SalasService } from './services/SalasService';
import { DadosService } from './services/dados.service';
import { ThemeService } from './services/theme.service';
import { AgendaService } from './services/agenda.service';
import { MacroService } from './services/macro.service';
import { RecursoService } from './services/recurso.service';
import { ReservasService } from './services/reservas.service';
import { SalasOldService } from './services/salas-old.service';
import { PeriodoLetivosService } from './services/periodo-letivos.service';
import { FaculdadeService } from './services/faculdade.service';
import { CursosService } from './services/cursos.service';
import { PeriodoLetivosCategoriasService } from './services/periodo-letivos-categorias.service';
import { PlDisciplinasAcademicosService } from './services/pl-disciplinas-academicos.service';


import { ZerosPipe } from './shared/pipes/zeros.pipe';
import { FormatadorDataPipe } from './shared/pipes/formatador-data.pipe';
import { FiltroSalasPipe } from './shared/pipes/filtro-salas.pipe';
import { FiltroUsuarioPipe } from './shared/pipes/filtro-usuario.pipe';
import { FiltroCursosPipe } from './shared/pipes/filtro-cursos.pipe';
import { RedimensionarDirective } from './shared/directives/redimensionar.directive';
import { SuperMacroComponent } from './components/pages/super-macro/super-macro.component';
import { SuperMacroService } from './services/super-macro.service';
import { CriaLoteSalasComponent } from './components/pages/lote-salas/cria-lote-salas/cria-lote-salas.component';
import { LoteSalasComponent } from './components/pages/lote-salas/lote-salas.component';
import { LoteSalasService } from './services/lote-salas.service';
import { ServidoresMoodleComponent } from './components/pages/servidores-moodle/servidores-moodle.component';
import { ServidoresMoodleService } from './services/servidores-moodle.service';
import { FormularioInsercaoUsuariosMoodleComponent } from './components/pages/servidores-moodle/formulario-insercao-usuarios-moodle/formulario-insercao-usuarios-moodle.component';
import { ObtemPldaComponent } from './components/pages/pl-disciplinas-academicos/obtem-plda/obtem-plda.component';
import { MacroSuperMacroService } from './services/macro-super-macro.service';
import { MacroSuperMacroComponent } from './components/pages/super-macro/macro-super-macro/macro-super-macro.component';
import { LoteSalasSimplificadoComponent } from './components/pages/lote-salas-simplificado/lote-salas-simplificado.component';
import { LoteSalasSimplificadoService } from './services/lote-salas-simplificado.service';
import { SalaSimplificadaComponent } from './components/pages/sala-simplificada/sala-simplificada.component';
import { SalaSimplificadaService } from './services/sala-simplificada.service';
import { GrupoLotesSimplificadosService } from './services/grupo-lotes-simplificados.service';
import { LogsComponent } from './components/pages/logs/logs.component';
import { LogsService } from './services/logs.service';
import { UnidadeOrganizacionalComponent } from './components/pages/unidade-organizacional/unidade-organizacional.component';
import { UnidadeOrganizacionalService } from './services/unidade-organizacional.service';
import { FormularioInsercaoUsuariosAdComponent } from './components/pages/unidade-organizacional/formulario-insercao-usuarios-ad/formulario-insercao-usuarios-ad.component';
import { FormularioAlteracaoUsuarioComponent } from './components/pages/unidade-organizacional/formulario-alteracao-usuario/formulario-alteracao-usuario.component';
import { FormularioPessoasEstatusLotacaoComponent } from './components/pages/usuarios/formulario-pessoas-estatus-lotacao/formulario-pessoas-estatus-lotacao.component';
import { PessoasEstatusLotacaoService } from './services/pessoas-estatus-lotacao.service';
import { RolesComponent } from './components/pages/roles/roles.component';
import { RolesService } from './services/roles.service';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/pages/home/home.component';
import { NavComponent } from './components/layouts/nav/nav.component';
import { HomeService } from './services/home.service';
import { CardComponent } from './components/layouts/card/card.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SalaEditorComponent } from './components/pages/salas/sala-editor/sala-editor.component';
import { ApiRequestsService } from './services/api-requests.service';
import { MeusCursosComponent } from './components/meus-cursos/meus-cursos.component';
import { TdCursosComponent } from './components/td-cursos/td-cursos.component';


@NgModule({
    declarations: [
        AppComponent,
        SalasComponent,
        ZerosPipe,
        FormatadorDataPipe,
        RedimensionarDirective,
        UsuariosComponent,
        FiltroSalasPipe,
        FiltroUsuarioPipe,
        FiltroCursosPipe,
        AgendaComponent,
        CalendarioComponent,
        MacroComponent,
        BuscadoresComponent,
        ArquivoComponent,
        ReservasComponent,
        RecursoComponent,
        SelectUsuarioComponent,
        SalasOldComponent,
        PeriodoLetivosComponent,
        FaculdadesComponent,
        CursosComponent,
        PeriodoLetivosCategoriasComponent,
        CriaSalasComponent,
        PlDisciplinasAcademicosComponent,
        SuperMacroComponent,
        CriaLoteSalasComponent,
        LoteSalasComponent,
        ServidoresMoodleComponent,
        FormularioInsercaoUsuariosMoodleComponent,
        ObtemPldaComponent,
        MacroSuperMacroComponent,
        LoteSalasSimplificadoComponent,
        SalaSimplificadaComponent,
        LogsComponent,
        UnidadeOrganizacionalComponent,
        FormularioInsercaoUsuariosAdComponent,
        FormularioAlteracaoUsuarioComponent,
        FormularioPessoasEstatusLotacaoComponent,
        RolesComponent,
        HomeComponent,
        NavComponent,
        CardComponent,
        LoginComponent,
        SalaEditorComponent,
        MeusCursosComponent,
        TdCursosComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        CheckboxModule,
        AutoCompleteModule,
        CalendarModule,
        SliderModule,
        DropdownModule,
        ColorPickerModule,
        FullCalendarModule,
        RadioButtonModule,
        FileUploadModule,
        ScrollingModule,
        CommonModule,
        MatCardModule,
        MatProgressBarModule,
        MatButtonModule,
        MatDividerModule,
        ReactiveFormsModule,
    ],
    providers: [
        SalasService,
        SalasOldService,
        DadosService,
        UsuarioService,
        AgendaService,
        ThemeService,
        MacroService,
        RecursoService,
        ReservasService,
        PeriodoLetivosService,
        PeriodoLetivosCategoriasService,
        FaculdadeService,
        CursosService,
        PlDisciplinasAcademicosService,
        SuperMacroService,
        MacroSuperMacroService,
        LoteSalasService,
        ServidoresMoodleService,
        LoteSalasSimplificadoService,
        SalaSimplificadaService,
        GrupoLotesSimplificadosService,
        UnidadeOrganizacionalService,
        PessoasEstatusLotacaoService,
        LogsService,
        RolesService,
        HomeService,
        ApiRequestsService,
        NavComponent,
    ],
    bootstrap: [
        AppComponent
    ],
    exports: [
        AutoCompleteModule
      ],
})
export class AppModule { }
