import { Injectable } from '@angular/core';
import { ArrayIndexador } from '../shared/array-indexador';
import { Arvore } from '../shared/arvore';
import { Estudante } from '../components/pages/pl-disciplinas-academicos/estudante';
import { UnidadeOrganizacional } from '../components/pages/unidade-organizacional/unidade-organizacional';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UnidadeOrganizacionalService {

	constructor(private http: HttpClient) { }

    ouDirRoot = "";
    ou_str = "OU=";
    arvoreOU: Arvore = new Arvore (0,null);

	unidadesOrganizacionais: UnidadeOrganizacional[] = [];
	unidadesOrganizacionaisIndex: ArrayIndexador<UnidadeOrganizacional> | undefined;



    criarContasAD(ouCadastro:string, ous: Array<any>, estudantesJSON:string, senha:unknown) {        
        return this.http.post("/formulario-insere-ad", {ouCadastro: ouCadastro, ous: ous, estudantes: estudantesJSON, senhaPadrao: senha})
            .toPromise()
            .then((response:any) => {
                return response.text();
            });
    }

    alteraSenhaUsuarios(estudantesJSON:string, senha:unknown) {
        return this.http.post("/formulario-altera-usuario/password", {estudantes: estudantesJSON, senhaPadrao: senha})
            .toPromise()
            .then((response:any) => {
                return response.text();
            });
    }

	listar() {
        return this.http.get("/unidade-organizacional/all")
            .toPromise()
            .then((response:any) => {
                this.unidadesOrganizacionais = UnidadeOrganizacional.generateList(response.json());
                this.unidadesOrganizacionaisIndex = new ArrayIndexador<UnidadeOrganizacional>(this.unidadesOrganizacionais);
                return this.unidadesOrganizacionais;
            });
    }

	create(ou:UnidadeOrganizacional) {
        return this.http.post("/unidade-organizacional",ou)
            .toPromise()
            .then(response => {
                return this.listar();
            });
    }
    update(ou:UnidadeOrganizacional) {
        return this.http.put("/unidade-organizacional/"+ou.id,ou)
            .toPromise()
            .then(response => {
                return this.listar();
            });
    }
    delete(ou:UnidadeOrganizacional) {
        return this.http.delete("/unidade-organizacional/"+ou.id)
            .toPromise()
            .then(response => {
                return this.listar();
            });
    }

    getOuDirRoot () {
        return this.http.get("/unidade-organizacional/ou-dir-root")
            .toPromise()
            .then((response:any) => {
                this.ouDirRoot = response.text();
                return this.ouDirRoot;
            });
    }
    setOuDirRoot (ouDirRoot:string) {
        return this.http.post("/unidade-organizacional/ou-dir-root", {"ou-dir-root" : ouDirRoot})
            .toPromise()
            .then((response:any) => {
                this.ouDirRoot = response.text();
                return this.ouDirRoot;
            });
    }

    substituiEmailsPorPadrao (estudantesJSON:unknown) {
        return this.http.post("/formulario-insere-ad/substitui-emails", {estudantes: estudantesJSON}).toPromise()
            .then((response:any) => {
                var estudantes = Estudante.converteObjectParaEstudantesComSenha( response.json() ) ;
                return estudantes;
            });
    }

    private processaFilhas (filhas:any) {

        var sortFunctionPorDado = function (a1:Arvore, a2:Arvore) {
            if ( a1.dado.toLowerCase() ==  a2.dado.toLowerCase() )
                return 0;
            return a1.dado.toLowerCase() < a2.dado.toLowerCase() ? -1 : 1;
        };

        var ous:any = {};
        var arvoreDir:Arvore = new Arvore(0, this.ouDirRoot);
        arvoreDir.sortFilhosArray = sortFunctionPorDado;
        var incrementador = 0;
        for (var i = 0; i < filhas.length; i++) {
            var arvore:Arvore = arvoreDir;
            for (var j = 0; j < filhas[i].length; j++) {
                var nodo = null;
                if (!ous.hasOwnProperty(filhas[i][j] + "-" + arvore.id + "-" + (j+1))) {
                    ous[filhas[i][j] + "-" + arvore.id + "-" + (j+1)] = ++incrementador;
                    nodo = new Arvore(incrementador, filhas[i][j]);
                    nodo.sortFilhosArray = sortFunctionPorDado;
                    arvore.insert (nodo);
                }
                else {
                    nodo = arvore.find(ous[filhas[i][j] + "-" + arvore.id + "-" + (j+1)]);
                }
                arvore = nodo;
            }
        }
        return arvoreDir;
    }

    getOuFilhas () {
        return this.http.get("/unidade-organizacional/ous-filhas")
            .toPromise()
            .then((response:any) => {
                var ouRoot = this.ouDirRoot;
                var _this = this;
                var ouFilhas = response.json().map(function (ou:any) {
                    if (ou == ouRoot)
                        return [];
                    _this.ou_str = ou.search("OU=") >= 0 ? "OU=" : (ou.search("Ou=") >= 0 ? "Ou=" : "ou=");
                    var ret = ou.replace ("," + ouRoot, "").split(_this.ou_str);
                    ret.splice(0,1);
                    for (var i = 0; i < ret.length-1; i++)
                        ret[i] = ret[i].substring(0,ret[i].length -1);
                    return ret.reverse();
                });
                this.arvoreOU = this.processaFilhas(ouFilhas)
                return this.arvoreOU;
            });
    }
}
