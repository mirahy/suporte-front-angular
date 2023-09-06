import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { Router } from '@angular/router';
import { NavComponent } from '../../layouts/nav/nav.component';

declare const jQuery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private usuarioService : UsuarioService,
              private router: Router,
              private nav: NavComponent){

  }
  

  logar(){

    if(this.formLogin.invalid) return;

    var usuario = this.formLogin.getRawValue() as Usuario;
    this.usuarioService.login(usuario)
    .then(response=>{
      const array:any  =[response];
      if(array.includes('error_description')){
        if(array['error_description']['email']){
          jQuery("#emailerror").html('<strong >' + array['error_description']['email'] + "</strong>");
        }
        if(array['error_description']['password']){
          jQuery("#passworderror").html('<strong >' + array['error_description']['password'] + "</strong>");
        }
      }
      this.nav.checkPermissao()
      this.router.navigate(['']);
    })

  }


  criarForm(){
    this.formLogin = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.criarForm();
  }

}
