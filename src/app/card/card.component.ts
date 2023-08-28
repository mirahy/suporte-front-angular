import { Component, Input  } from '@angular/core';

import { AbstractComponent } from '../abstract-component';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent extends AbstractComponent{
@Input() title: any;
@Input() link: any;
@Input() classCard: any;
@Input() classIcon: any;
@Input() classLink: any;

}
