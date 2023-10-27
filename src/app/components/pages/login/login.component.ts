import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../../models/usuario';
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
    jQuery("#msgerror").html('');

    if(this.formLogin.invalid) return;

    var usuario = this.formLogin.getRawValue() as Usuario;
    this.usuarioService.login(usuario)
    .then(response=>{
      try {
        if(!(typeof response.error_description === "undefined")){
          if(response.error_description.email !== undefined){
            jQuery("#msgerror").html('<strong >' + response.error_description.email + "</strong>");
          }
          if(response.error_description.password !== undefined){
            jQuery("#msgerror").html('<strong >' + response.error_description.password + "</strong>");
          }
        }
        
      } catch (error:any) {
        console.log(error)
      }
      if(this.usuarioService.logado){
        this.nav.ngOnInit()
        this.router.navigate(['home']);
      }
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
