export class Usuario {
    
	id:number|any;
    name:string|any;
    email:string|any;
    permissao:string|any;
    gestor:boolean|any;
    password:string|any

    constructor (id:number|object|any,name?:string|any,email?:string|any,permissao?:string|any,gestor?:boolean|any, password?:string|any) {
        if (typeof id == 'number') {
            this.id = id;
            this.name = name;
            this.email = email;
            this.permissao = permissao;
            this.gestor = gestor;
            this.password = password;
        }
        else {
            this.id = parseInt(id['id']);
            this.name = id['name'];
            this.email = id['email'];
            this.permissao = id['permissao'];
            this.gestor = id['gestor'];
            this.password = id['password'];
        }
    }

    public static generateList (list:Array<any>):Array<Usuario> {
        var usuarioList: Array<Usuario> = [];
        list.forEach(usuarioAny => {
            var usuario = new Usuario(usuarioAny)
            usuarioList.push(usuario);
        });
        return usuarioList;
    };

    public clone ():Usuario {
        return new Usuario (this);
    }
}