import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujoCajaRedirectComponent } from './flujo-caja-redirect.component';

describe('FlujoCajaRedirectComponent', () => {
  let component: FlujoCajaRedirectComponent;
  let fixture: ComponentFixture<FlujoCajaRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlujoCajaRedirectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlujoCajaRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
