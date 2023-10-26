import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { ApiRequestsService } from './api-requests.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MessagesSweetalertService } from './messages-sweetalert.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuarios: Array<Usuario> = [];

  constructor(private http: HttpClient, 
              private api: ApiRequestsService,
              private router: Router,
              private msg: MessagesSweetalertService) {}

  async login(data: any) {
    try {
      const csrf = await this.api.getUrl('sanctum/csrf-cookie');
      const response = await this.api.post('login', data);
      if (!response.data.error) {
        localStorage.setItem(
          environment.storage_token,
          btoa(JSON.stringify(response.data.token.plainTextToken))
        );
        localStorage.setItem(
          environment.storage_user,
          btoa(JSON.stringify(response.data.user))
        );
      } else {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }

   logout() {
    let token = this.obterTokenUsuario
      this.api.get('logout', token)
      .then(response =>{
        localStorage.removeItem(environment.storage_token);
        localStorage.removeItem(environment.storage_user);
        this.router.navigate(['login']);
        this.msg.msgHttp(response)
      })
      .catch(response => {
        localStorage.removeItem(environment.storage_token);
        localStorage.removeItem(environment.storage_user);
        this.router.navigate(['login']);
        this.msg.msgHttp(response.response)
      })
  }

  get obterUsuarioLogado(): Usuario {
    return localStorage.getItem(environment.storage_user)
      ? JSON.parse(atob(localStorage.getItem(environment.storage_user)!))
      : null;
  }
  get obterIdUsuarioLogado(): string {
    return localStorage.getItem(environment.storage_user)
      ? (
          JSON.parse(
            atob(localStorage.getItem(environment.storage_user)!)
          ) as Usuario
        ).id
      : null;
  }
  get obterTokenUsuario(): string {
    return localStorage.getItem(environment.storage_token)
      ? JSON.parse(atob(localStorage.getItem(environment.storage_token)!))
      : null;
  }
  get logado(): boolean {
    return localStorage.getItem(environment.storage_token) ? true : false;
  }

  get firstLastNameUser() {
    const user: Usuario = this.obterUsuarioLogado;
    if (user) {
      const nomeCompleto = user.name;
      const nome = nomeCompleto.split(' ')[0];
      const sobreNome =
        nomeCompleto.split(' ')[nomeCompleto.split(' ').length - 1];
      return nome + ' ' + sobreNome;
    }
    return '';
  }

  get permissao() {
    const user = this.logado ? this.obterUsuarioLogado : null;
    return user ? user.permissao : '';
  }

  get keepUser() {
    const user = this.logado ? this.obterUsuarioLogado : null;
    return user ? user.keepUser : '';
  }

  async listaUsuarios() {
    try {
      const response = await this.api.get('usuarios/lista');
      this.usuarios = Usuario.generateList(response.data);
      return this.usuarios;
    } catch (error: any) {
      return this.msg.msgHttp(error.response)
    }
  }

  async listaUsuariosCriaSala(): Promise<Array<Usuario>> {
    try {
      const response = await this.api.get('salas/usuarios');
      this.usuarios = Usuario.generateList(response.data);
      return this.usuarios;
    } catch (error: any) {
      return error;
    }
  }

  async novoUsuario(usuario: Usuario): Promise<Array<Usuario>> {
    const response = await this.api.post('usuarios', usuario);
    this.usuarios = Usuario.generateList(response.data);
    return this.usuarios;
  }

  async alteraPermissao(usuario: Usuario): Promise<Usuario | unknown> {
    try {
      const response = await this.api.put('usuarios/' + usuario.id, usuario);
      const u = new Usuario(response.data);
      for (var i in this.usuarios) {
        if (this.usuarios[i].id == u.id)
          this.usuarios[i].permissao = u.permissao;
      }
      return null;
    } catch (response) {
      return response;
    }
  }

  async usuarioLogado() {
    try {
      const response = await this.api.get('logado');
      const u = new Usuario(response.data);
      return u;
    } catch (error:any) {
      this.msg.msgHttp(error.response)
      return false
    }
  }
}
