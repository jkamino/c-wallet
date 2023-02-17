import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAddressDialogComponent } from './register-address-dialog.component';

describe('RegisterAddressDialogComponent', () => {
  let component: RegisterAddressDialogComponent;
  let fixture: ComponentFixture<RegisterAddressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterAddressDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
