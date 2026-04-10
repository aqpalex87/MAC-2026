import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeudasPotencialIndirectasModalComponent } from './deudas-potencial-indirectas-modal.component';

describe('DeudasPotencialIndirectasModalComponent', () => {
  let component: DeudasPotencialIndirectasModalComponent;
  let fixture: ComponentFixture<DeudasPotencialIndirectasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeudasPotencialIndirectasModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeudasPotencialIndirectasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
