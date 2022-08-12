import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBySecretKeyComponent } from './create-by-secret-key.component';

describe('LoginBySecretKeyComponent', () => {
  let component: CreateBySecretKeyComponent;
  let fixture: ComponentFixture<CreateBySecretKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBySecretKeyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBySecretKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
