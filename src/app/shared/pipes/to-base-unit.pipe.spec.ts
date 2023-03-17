import { TestBed } from '@angular/core/testing';
import { Erc20Service } from 'src/app/services/erc20/erc20.service';
import { ToBaseUnitPipe } from './to-base-unit.pipe';

describe('ToBaseUnitPipe', () => {
  let pipe: ToBaseUnitPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToBaseUnitPipe],
      providers: [{ provide: Erc20Service, useClass: Erc20Service }],
    });
  });
  it('create an instance', () => {
    pipe = TestBed.inject(ToBaseUnitPipe);
    expect(pipe).toBeTruthy();
  });
});
