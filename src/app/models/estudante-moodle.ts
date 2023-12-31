export class EstudanteMoodle {
    username;
    email;
    fullname;
    is_professor = false;
    senha;

    constructor (username:any, email:any, fullname:any, is_professor?:any, senha?:any) {
        this.username = username;
        this.email = email;
        this.fullname = fullname;
        this.is_professor = is_professor ? is_professor : false;
        this.senha = senha;
    }
    isValid() {
        return this.username.length > 0 && this.email.length > 0 && this.fullname.length > 0;
    }
    equals (estudante: EstudanteMoodle) {
        return this.username == estudante.username && 
            this.email == estudante.email &&
            this.fullname == estudante.fullname &&
            this.is_professor == estudante.is_professor &&
            this.senha == estudante.senha;
    }
    
    static processaCSV(allText:any):Array<EstudanteMoodle> {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var linhas:Array<EstudanteMoodle> = [];
        //linhas.push (headers);
        var i = headers[0] == "username" ? 1 : 0;
        for (; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {
                var tupla = new EstudanteMoodle(data[0], data[1], data[2], false);
                linhas.push(tupla);
            }
        }
        return linhas;
    }
    static converteEstudantesParaJSON(estudantes:Array<EstudanteMoodle>) :string {
        var linhas = [];

        for (var i = 0; i < estudantes.length; i++) {
            var tupla = [estudantes[i].username, estudantes[i].email, estudantes[i].fullname, estudantes[i].is_professor];
            linhas.push(tupla);
        }
        return JSON.stringify(linhas);
    }
    static converteJSONParaEstudantes(estudantesJSON:string) : Array<EstudanteMoodle> {
        var linhas:Array<EstudanteMoodle> = [];
        if (estudantesJSON) {
            var estudantesArr = JSON.parse(estudantesJSON) ;
            for (var i = 0; i < estudantesArr.length; i++) {
                    var tupla = new EstudanteMoodle(estudantesArr[i][0], estudantesArr[i][1], estudantesArr[i][2], estudantesArr[i][4]);
                    linhas.push(tupla);
            }
        }
        return linhas;
    }

    static processaCSVcomSenha(allText:any):Array<EstudanteMoodle> {
        var allTextLines = allText.split(/\r\n|\n|\r/);
        var headers = allTextLines[0].split(',');
        var linhas:Array<EstudanteMoodle> = [];
        //linhas.push (headers);
        var i = headers[0] == "username" ? 1 : 0;
        for (; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == 4) {
                var tupla = new EstudanteMoodle(data[0], data[1], data[2], false, data[3]);
                linhas.push(tupla);
            }
            if (data.length == 3) {
                var tupla = new EstudanteMoodle(data[0], data[1], data[2], false, "");
                linhas.push(tupla);
            }
        }
        return linhas;
    }
    static converteEstudantesParaJSONcomSenha(estudantes:Array<EstudanteMoodle>) :string {
        var linhas = [];

        for (var i = 0; i < estudantes.length; i++) {
            var tupla = [estudantes[i].username, estudantes[i].email, estudantes[i].fullname, estudantes[i].senha, estudantes[i].is_professor];
            linhas.push(tupla);
        }
        return JSON.stringify(linhas);
    }
    static converteJSONParaEstudantesComSenha(estudantesJSON:string) : Array<EstudanteMoodle> {
        var linhas:Array<EstudanteMoodle> = [];
        if (estudantesJSON) {
            var estudantesArr = JSON.parse(estudantesJSON) ;
            for (var i = 0; i < estudantesArr.length; i++) {
                    var tupla = new EstudanteMoodle(estudantesArr[i][0], estudantesArr[i][1], estudantesArr[i][2], estudantesArr[i][3], estudantesArr[i][4]);
                    linhas.push(tupla);
            }
        }
        return linhas;
    }

    static converteObjectParaEstudantesComSenha (estudantesObj:any) {
        var estudantes : EstudanteMoodle[] = [];
        for (var i = 0; i < estudantesObj.length; i++) {
            estudantes.push(new EstudanteMoodle(estudantesObj[i].username, estudantesObj[i].email, estudantesObj[i].fullname, estudantesObj[i].is_professor, estudantesObj[i].senha));
        }
        return estudantes;
    }

    static generateEstudante() : EstudanteMoodle {
        return new EstudanteMoodle("","","",false,null);
    }
}