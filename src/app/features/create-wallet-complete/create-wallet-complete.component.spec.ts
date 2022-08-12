import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWalletCompleteComponent } from './create-wallet-complete.component';

describe('CreateWalletCompleteComponent', () => {
  let component: CreateWalletCompleteComponent;
  let fixture: ComponentFixture<CreateWalletCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWalletCompleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWalletCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
