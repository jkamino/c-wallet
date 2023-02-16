import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20TransferComponent } from './erc20-transfer.component';

describe('Erc20TransferComponent', () => {
  let component: Erc20TransferComponent;
  let fixture: ComponentFixture<Erc20TransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Erc20TransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20TransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
