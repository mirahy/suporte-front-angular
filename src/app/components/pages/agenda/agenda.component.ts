/* eslint-disable @typescript-eslint/no-this-alias */
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
//import { ThemeService } from '../theme.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin  from '@fullcalendar/list';
//import { Theme } from './theme';
import { FullCalendarModule } from '@fullcalendar/angular';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Redimensionavel } from 'src/app/shared/redimensionavel';
import { DadosService } from 'src/app/services/dados.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Theme } from '../../../models/theme';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { EventoGerador } from '../../../models/evento-gerador';
import { AgendaService } from 'src/app/services/agenda.service';
declare const jQuery: any;

@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    styleUrls: ['./agenda.component.less']
})
export class AgendaComponent extends AbstractComponent implements OnInit {

    selectedTheme: Theme = new Theme("","");
    data: Date = new Date();
    rangeDates:any = new Date();
    temas: SelectItem[] = [];
    
    
    options: any;

    pt: any;
    intervalGamb:any = 0;

    tamanho = 500;

    @ViewChild('fc') 
    fc: FullCalendarModule = new FullCalendarModule;


    constructor(private themeService: ThemeService, private dadosService:DadosService, private agendaService:AgendaService) {
        super();
        /*var themes: Theme[] = Theme.getThemes();

        for (var i in themes) {
            this.temas.push({ label: themes[i].name, value: themes[i] })
            if (themes[i].name == "luna-green")
                this.selectedTheme = themes[i];
        }*/
    }
    onThemeSelect() {
        //this.themeService.setTheme(this.selectedTheme.name);
    }
    get evento() {
        return this.agendaService.evento;
    }
    set evento (evento) {
        this.agendaService.evento = evento;
    }
    get events() {
        return this.agendaService.events;
    }
    set events(events) {
        this.agendaService.events = events;
    }
    

    ngOnInit() {
        this.events = [];
        this.editavel = true;
        this.agendaService.listar().then ((response : any) => {
            return response
        });
        
        // Alterando o texto "Compromissos" para "Lista"
        ptBrLocale.buttonText!['list']  = "Lista" ;
        this.options = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ],
            defaultDate: new Date(),
            header: {
                left: 'prev,next today',
                center: 'title',
                right: "dayGridMonth,timeGridWeek,listMonth" //"dayGridMonth,timeGridWeek,timeGridDay,listMonth  dayGridDay,dayGridWeek"
            },
            selectable: true,
            height: this.tamanho,
            locales: [ptBrLocale],
            locale: "pt-br",
            //editable: true,
            //deepChangeDetection: true,
            //weekends: false,
            //showNonCurrentDates: true,
            dateClick: (e : any) =>  {
                //console.log (e);
            },
            select: (e : any) => {
                this.evento = EventoGerador.obtemEvento(e);
                //jQuery("#dialogEvento").modal('show');
            },
            unselect: (e : any) => {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const _this = this;
                this.intervalGamb = setTimeout (function (){
                    _this.resetEvento();
                },20);
            },
            eventClick: (e : any) =>  {
                this.evento = EventoGerador.obtemEvento(e.event);
                jQuery("#dialogEvento").modal('show');
                //this.modifyProp(0, "teste")
                //e.event.date = new Date()
                //e.el.style.borderColor = 'red';
            }
        };
        const _this = this;
        setTimeout (function () {
            _this.resize()
        }, 10);

        this.pt = {
            firstDayOfWeek: 0,
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
              'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            today: 'Hoje',
            clear: 'Limpar'
        };
    }
    aee (event : any) {
        event.jsEvent.preventDefault(); // don't let the browser navigate

        console.log("event")
    }
    modifyProp(eventIndex : any, newTitle : any) {
        const calendarEvents = this.events.slice(); // a clone
        const singleEvent = Object.assign({}, calendarEvents[eventIndex]); // a clone
        singleEvent.title = newTitle;
        calendarEvents[eventIndex] = singleEvent;
        this.events = calendarEvents; // reassign the array
        //.fullCalendar( ‘renderEvent’, event [, stick ] )
    }

    resetEvento() {
        this.evento = new EventoGerador();
    }

    changeAllDay () {
        /*var nextDay = new Date(day);
        nextDay.setDate(day.getDate()+1);*/
    }
    changeMaisDay () {
        if (this.evento.maisDay) {
            this.evento.end = new Date(this.evento.start);
            this.evento.end.setDate(this.evento.start.getDate()+1);
        }
    }

    addEvent() {
        if (!this.evento.title) {
            alert ("Insira um Título");
            document.getElementById('tituloInput')!.focus();
            return;
        }
        if ( (this.evento.end ? this.evento.start.getTime() > this.evento.end.getTime() : false) ||  (this.evento.horaEnd ? this.evento.horaStart.getTime() > this.evento.horaEnd.getTime() : false)  ){
            alert ("O início não pode ser depois do fim");
            return;
        }
        
        if (this.evento.id) {
            if (confirm ("Confirmar alteração deste Evento?")) {
                this.agendaService.update()
                    .then((response : any) => {
                        jQuery("#dialogEvento").modal('hide');
                    })
                    .catch ((response : any) => {
                        alert("Falha na criação do evento!");
                    });
            }
        }
        else {
            this.agendaService.create()
                .then((response : any) => {
                    jQuery("#dialogEvento").modal('hide');
                })
                .catch ((response : any) => {
                    alert("Falha na criação do evento!");
                });
        }
        
    }
    delEvent(e : any) {
        if (this.evento.id > 0 && confirm ("Confirmar exclusão deste Evento?")) 
            this.agendaService.delete().then ((response : any) => {
                jQuery("#dialogEvento").modal('hide');
            })
    }

    update() {
        //incorrect
        /*this.events.push({
            "title": "Conference",
            "start": "2019-06-11",
            "end": "2019-06-13"
        });*/
    
        //correct
        /*this.events = [...this.events, {
            "title": "Conference",
            "start": "2019-06-12",
            "end": "2019-06-14"
        }];*/
        this.events = [...this.events, {
            "title": "Conference",
            "date": this.data.toJSON()
        }];
        //console.log (this.fc)
        
        //incorrect
        //this.options.weekends = false;
    
        //correct
        //this.options = [...this.options, { weekends: false }];
        //this.options = {...this.options, { height: 600 }};
    }
    janela () {
        this.editavel = true;
        if (this.intervalGamb) {
            clearTimeout(this.intervalGamb);
        }
        //this.evento = new EventoGerador();
        setTimeout(function () {
            document.getElementById('tituloInput')!.focus();
        }, 500);
    }
    resize() {
        
        const redimensionaAgenda = function ( parametros : any) {
            parametros.componente.calendar.setOption('height', parametros.tamanho);
        }
        const red:Redimensionavel = new Redimensionavel(null, 252,450,null, {funcao: redimensionaAgenda, parametros: {componente: this.fc, tamanho:this.tamanho}});
        this.dadosService.componentesPersonalizados.push(red);
        this.dadosService.resizeFull();
    }

}
