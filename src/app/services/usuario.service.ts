import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../components/pages/usuarios/usuario';
import { ApiRequestsService } from './api-requests.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuarios: Array<Usuario> = [];


  constructor(
    private http: HttpClient,
    private api: ApiRequestsService,
  ) {}

  async login(data: any) {
    try {
      const csrf = await this.api.getUrl('sanctum/csrf-cookie')
      const response = await  this.api.post('login', data)
          if(!response.data.error){
              localStorage.setItem(environment.storage_token, btoa(JSON.stringify(response.data.token.plainTextToken)));
              localStorage.setItem(environment.storage_user, btoa(JSON.stringify(response.data.user))); 
          }else{
            return response.data
          } 
    } catch (error) {
      return error
    }
  }

  async logout() {   
    try {
      const response = await this.api.get('logout');
      localStorage.removeItem(environment.storage_token);
      localStorage.removeItem(environment.storage_user);
      return true;
    } catch (response) {
      localStorage.removeItem(environment.storage_token);
      localStorage.removeItem(environment.storage_user);
      return true;
    }
    
  }

  get obterUsuarioLogado(): Usuario {
    return localStorage.getItem(environment.storage_user)
      ? JSON.parse(atob(localStorage.getItem(environment.storage_user)!))
      : null;
  }
  get obterIdUsuarioLogado(): string {
    return localStorage.getItem(environment.storage_user)
      ? (JSON.parse(atob(localStorage.getItem(environment.storage_user)!)) as Usuario).id
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
    const user:Usuario = this.obterUsuarioLogado
    if(user){
      const nomeCompleto = user.name
      const nome = nomeCompleto.split(" ")[0]
      const sobreNome = nomeCompleto.split(" ")[(nomeCompleto.split(" ").length)-1]
      return nome +" "+sobreNome
    }
    return ''; 
  }

  get permissao(){
        const user = this.logado ? this.obterUsuarioLogado : null
        return user ? user.permissao : ''; 
  }

  async listaUsuarios() : Promise<Array<Usuario>>{
    try {
      const response = await this.api.get('usuarios/lista')
      this.usuarios = Usuario.generateList(response.data);
      return this.usuarios;  
    } catch (error:any) {
      return error
    }
 
    
  }

  async listaUsuariosCriaSala(): Promise<Array<Usuario>>{
    try {
      const response = await this.api.get('salas/usuarios');
      this.usuarios = Usuario.generateList(response.data);
      return this.usuarios;    
    } catch (error:any) {
      return error
    }
  }

  novoUsuario(usuario: Usuario) {
    return this.http
      .post('usuarios', usuario)
      .toPromise()
      .then((response: any) => {
        this.usuarios = Usuario.generateList(response.json());
        return this.usuarios;
      });
  }

  alteraPermissao(usuario: Usuario): Promise<Usuario> {
    return this.http
      .put('usuarios/' + usuario.id, usuario)
      .toPromise()
      .then((response: any) => {
        const u = new Usuario(response.json());
        for (var i in this.usuarios) {
          if (this.usuarios[i].id == u.id)
            this.usuarios[i].permissao = u.permissao;
        }
        return null;
      })
      .catch((response) => {
        return response;
      });
  }

  usuarioLogado() {
    return this.api.get('logado').then((response) => {
      const u = new Usuario(response);
      return u;
    });
  }
  
}
