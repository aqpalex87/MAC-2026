import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeudasPotencialDirectasModalComponent } from './deudas-potencial-directas-modal.component';

describe('DeudasPotencialDirectasModalComponent', () => {
  let component: DeudasPotencialDirectasModalComponent;
  let fixture: ComponentFixture<DeudasPotencialDirectasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeudasPotencialDirectasModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeudasPotencialDirectasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
