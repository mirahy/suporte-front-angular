export class Usuario {
    
	id:number|any;
    name:string|any;
    email:string|any;
    permissao:string|any;
    gestor:boolean|any;
    password:string|any;
    keepUser:boolean|any;

    constructor (id:number|object|any,name?:string|any,email?:string|any,permissao?:string|any,gestor?:boolean|any, password?:string|any, keepUser?:boolean|any) {
        if (typeof id == 'number') {
            this.id = id;
            this.name = name;
            this.email = email;
            this.permissao = permissao;
            this.gestor = gestor;
            this.password = password;
            this.keepUser = keepUser;
        }
        else {
            this.id = parseInt(id['id']);
            this.name = id['name'];
            this.email = id['email'];
            this.permissao = id['permissao'];
            this.gestor = id['gestor'];
            this.password = id['password'];
            this.keepUser = id['keepUser'];
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