import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../components/pages/usuarios/usuario';
import { ApiRequestsService } from './api-requests.service';

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
    return await this.api.post('login', data).then((response: any) => {
        console.log(response.data)
        if(!response.data.error){
            localStorage.setItem('token',btoa(JSON.stringify(response.data.token.plainTextToken)));
            localStorage.setItem('usuario', btoa(JSON.stringify(response.data.user)));
        }else{
            return response.data
        }
    });
  }

  logout() {
      
    return this.api.get('logout').then((response) => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return true;
    })
    .catch((reponse) =>{
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return true
    })
    ;
    
  }

  get obterUsuarioLogado(): Usuario {
    return localStorage.getItem('usuario')
      ? JSON.parse(atob(localStorage.getItem('usuario')!))
      : null;
  }
  get obterIdUsuarioLogado(): string {
    return localStorage.getItem('usuario')
      ? (JSON.parse(atob(localStorage.getItem('usuario')!)) as Usuario).id
      : null;
  }
  get obterTokenUsuario(): string {
    return localStorage.getItem('token')
      ? JSON.parse(atob(localStorage.getItem('token')!))
      : null;
  }
  get logado(): boolean {
    return localStorage.getItem('token') ? true : false;
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

  async listaUsuarios(): Promise<Array<Usuario>> {
    const response: any = await this.http.get('usuarios/lista').toPromise();
    this.usuarios = Usuario.generateList(response.json());
    return this.usuarios;
  }

  listaUsuariosCriaSala(): Promise<Array<Usuario>> {
    return this.http
      .get('salas/usuarios')
      .toPromise()
      .then((response: any) => {
        this.usuarios = Usuario.generateList(response.json());
        return this.usuarios;
      });
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
