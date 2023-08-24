import { Component, Injectable, OnInit } from '@angular/core';

import { HomeService } from '../home.service'; 
import { AbstractComponent } from '../abstract-component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent extends AbstractComponent {

  constructor(private HomeService: HomeService){
    super();
  }
 

  clickToogle(){

   this.HomeService.clickToogle();
  
  }


}
