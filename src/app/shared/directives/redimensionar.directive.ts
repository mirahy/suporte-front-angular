import { Directive, ElementRef, Input } from '@angular/core';
import { DadosService } from 'src/app/services/dados.service';
import { Redimensionavel } from '../redimensionavel';
declare var jQuery: any;

@Directive({
    selector: '[redimensionar]'
})
export class RedimensionarDirective {

    private _redimensionar:number | any;
    redimensionavel:Redimensionavel| undefined;

    constructor(private el?:ElementRef, private dadosService?:DadosService) {
        jQuery(this.el!.nativeElement).addClass('linha-full-height');
    }

    get redimensionar():number|any {
        return this._redimensionar;
    }
    @Input()
    set redimensionar(value:number|any) {
        this._redimensionar = value;
        this.processa();
    }

    processa() {
        if (this.redimensionavel == null) {
            this.redimensionavel = new Redimensionavel(this.el!.nativeElement, this.redimensionar);
            this.dadosService!.componentesHeight.push(this.redimensionavel);
        }
        else
            this.redimensionavel.base = this.redimensionar;
        this.dadosService!.resizeFull();
    }
}
