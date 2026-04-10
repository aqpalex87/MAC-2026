import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLoginComponent } from './error-login.component';

describe('ErrorLoginComponent', () => {
  let component: ErrorLoginComponent;
  let fixture: ComponentFixture<ErrorLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
