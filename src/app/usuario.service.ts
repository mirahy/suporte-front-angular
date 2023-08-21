import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuarios/usuario';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    usuarios: Array<Usuario> = [];

    constructor(private http: HttpClient) {
    }

    async listaUsuarios(): Promise<Array<Usuario>> {
        const response:any = await this.http.get('usuarios/lista')
            .toPromise();
        this.usuarios = Usuario.generateList(response.json());
        return this.usuarios;
    }

    listaUsuariosCriaSala(): Promise<Array<Usuario>> {
        return this.http.get('salas/usuarios').toPromise()
            .then((response:any) => {
                this.usuarios = Usuario.generateList(response.json());
                return this.usuarios;
            })
    }

    novoUsuario (usuario : Usuario) {
        return this.http.post('usuarios', usuario).toPromise()
            .then((response:any) => {
                this.usuarios = Usuario.generateList(response.json());
                return this.usuarios;
            })
    }

    alteraPermissao(usuario: Usuario): Promise<Usuario> {
        return this.http.put("usuarios/" + usuario.id, usuario).toPromise()
            .then((response:any) => {
                var u = new Usuario(response.json());
                for (var i in this.usuarios) {
                    if (this.usuarios[i].id == u.id)
                        this.usuarios[i].permissao = u.permissao;
                }
                return null;
            })
            .catch(response => {
                return response;
            })
    }

    usuarioLogado(): Promise<Usuario> {
        return this.http.get("/logado") .toPromise()
            .then ((response:any) => {
                var u = new Usuario(response.json())
                return u;
            }); 
    }
}
