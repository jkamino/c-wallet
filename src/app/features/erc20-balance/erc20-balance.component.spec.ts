import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20BalanceComponent } from './erc20-balance.component';

describe('Erc20BalanceComponent', () => {
  let component: Erc20BalanceComponent;
  let fixture: ComponentFixture<Erc20BalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Erc20BalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20BalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
