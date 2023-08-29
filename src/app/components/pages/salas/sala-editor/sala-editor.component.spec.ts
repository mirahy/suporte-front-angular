import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaEditorComponent } from './sala-editor.component';
import { FormsModule } from '@angular/forms';

describe('SalaEditorComponent', () => {
  let component: SalaEditorComponent;
  let fixture: ComponentFixture<SalaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ SalaEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
