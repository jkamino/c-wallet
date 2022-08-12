import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentNftDetailComponent } from './content-nft-detail.component';

describe('ContentNftDetailComponent', () => {
  let component: ContentNftDetailComponent;
  let fixture: ComponentFixture<ContentNftDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentNftDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentNftDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
