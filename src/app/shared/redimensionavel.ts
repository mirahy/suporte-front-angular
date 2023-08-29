export class Redimensionavel {

        elemento:any;
        base:number|any;
        min:number|unknown;
        max:number|unknown;
        personalizado:any; // {funcao, parametros }
    
        constructor(elemento:any,base:any,min?:any,max?:any,personalizado?:any) {
            this.elemento = elemento;
            this.base = parseInt(base);
            this.min = min != null ? parseInt(min) : null;
            this.max = max != null ? parseInt(max) : null;
            this.personalizado = personalizado;
        }

        executarPersonalizado () {
            this.personalizado.funcao (this.personalizado.parametros);
        }
    
    }
    