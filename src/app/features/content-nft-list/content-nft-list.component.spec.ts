import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentNftListComponent } from './content-nft-list.component';

describe('ContentNftListComponent', () => {
  let component: ContentNftListComponent;
  let fixture: ComponentFixture<ContentNftListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentNftListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentNftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
