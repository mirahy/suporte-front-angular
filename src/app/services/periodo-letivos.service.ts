import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArrayIndexador } from '../shared/array-indexador';
import { PeriodoLetivo } from '../components/pages/periodo-letivos/periodo-letivo';

@Injectable(
    //{providedIn: 'root'}
)
export class PeriodoLetivosService {

    periodoLetivos: Array<PeriodoLetivo> = [];
    periodoLetivosIndex: any = {};
    periodoLetivosIdIndex: ArrayIndexador<PeriodoLetivo> | any;
    periodoLetivosKeyIndex: ArrayIndexador<PeriodoLetivo> | any;
    periodoLetivosNameIndex: ArrayIndexador<PeriodoLetivo> | any;

    constructor(private http: HttpClient) { }

    getPeriodoLetivos() {
        return this.http.get("/periodo-letivos/all").toPromise()
            .then((response:any) => {
                var pls = response.json();
                this.periodoLetivos = [];
                this.periodoLetivosIndex = {};
                for (var i in pls) {
                    var pl = new PeriodoLetivo(pls[i]);
                    this.periodoLetivos.push(pl);
                    this.periodoLetivosIndex[pl.id] = i;
                }
                this.periodoLetivosIdIndex = new ArrayIndexador<PeriodoLetivo>(this.periodoLetivos);
                this.periodoLetivosKeyIndex = new ArrayIndexador<PeriodoLetivo>(this.periodoLetivos,'id_sigecad');
                this.periodoLetivosNameIndex = new ArrayIndexador<PeriodoLetivo>(this.periodoLetivos,'nome');
                return this.periodoLetivos;
            });
    }

    getPeriodoLetivosSigecad():Promise<Array<PeriodoLetivo>> {
        return this.http.get("/periodo-letivos/sigecad").toPromise()
            .then((response:any) => {
                var pls = response.json();
                var periodoLetivosSigecad:Array<PeriodoLetivo> = [];
                for (var i in pls) {
                    var pl = new PeriodoLetivo(pls[i]);
                    periodoLetivosSigecad.push(pl);
                }
                return periodoLetivosSigecad;
            });
    }

    getPeriodoLetivoIdPadrao () {
        return this.http.get("/periodo-letivos/id-padrao").toPromise()
            .then((response:any) => {
                return response.json();
            });
    }

    createUpdate(pl:PeriodoLetivo) {
        if (pl.id) {
            return this.http.put("/periodo-letivos/" + pl.id, pl).toPromise()
                .then((response:any) => {
                    this.getPeriodoLetivos();
                    return response.json();
                });
        }
        else {
            return this.http.post("/periodo-letivos/", pl).toPromise()
                .then((response:any) => {
                    this.getPeriodoLetivos();
                    return response.json();
                });
        }
    }

    delete(pl:PeriodoLetivo) {
        return this.http.delete("/periodo-letivos/" + pl.id).toPromise()
            .then((response:any) => {
                this.getPeriodoLetivos();
                return response.json();
            });
    }
}
