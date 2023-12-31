import { Component, Input  } from '@angular/core';

import { AbstractComponent } from '../../../shared/components/abstract-component';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent extends AbstractComponent{
@Input() title: any;
@Input() link: any;
@Input() titleOver: any;
@Input() classCard: any;
@Input() classIcon: any;
@Input() classLink: any;


}
