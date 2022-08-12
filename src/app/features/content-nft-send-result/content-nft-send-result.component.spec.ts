import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentNftSendResultComponent } from './content-nft-send-result.component';

describe('ContentNftSendResultComponent', () => {
  let component: ContentNftSendResultComponent;
  let fixture: ComponentFixture<ContentNftSendResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentNftSendResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentNftSendResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
