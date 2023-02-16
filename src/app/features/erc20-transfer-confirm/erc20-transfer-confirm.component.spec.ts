import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20TransferConfirmComponent } from './erc20-transfer-confirm.component';

describe('Erc20TransferConfirmComponent', () => {
  let component: Erc20TransferConfirmComponent;
  let fixture: ComponentFixture<Erc20TransferConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Erc20TransferConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20TransferConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
