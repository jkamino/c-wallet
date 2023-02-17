import { Pipe, PipeTransform } from '@angular/core';
import { Erc20Service } from 'src/app/services/content/erc20.service';
@Pipe({
  name: 'toBaseUnit'
})
export class ToBaseUnitPipe implements PipeTransform {

  constructor(
    private erc20Service: Erc20Service
  ) {}
  transform(value: string | undefined, digits: number=18): string {
    return this.erc20Service.toBaseUnit(value, digits);
  }
}
