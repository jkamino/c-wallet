import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractSelectComponent } from './contract-select.component';

describe('ContractSelectComponent', () => {
  let component: ContractSelectComponent;
  let fixture: ComponentFixture<ContractSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
