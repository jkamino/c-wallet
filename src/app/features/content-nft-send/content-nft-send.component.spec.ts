import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentNftSendComponent } from './content-nft-send.component';

describe('ContentNftSendComponent', () => {
  let component: ContentNftSendComponent;
  let fixture: ComponentFixture<ContentNftSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentNftSendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentNftSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
