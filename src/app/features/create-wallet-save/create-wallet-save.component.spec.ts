import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWalletSaveComponent } from './create-wallet-save.component';

describe('CreateWalletSaveComponent', () => {
  let component: CreateWalletSaveComponent;
  let fixture: ComponentFixture<CreateWalletSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWalletSaveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWalletSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
