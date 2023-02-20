import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Erc20BalanceOf } from 'src/app/models/models.types';
import { Web3Service } from '../web3/web3.service';

@Injectable({
  providedIn: 'root',
})
export class Erc20Service {
  private _erc20$: BehaviorSubject<Erc20BalanceOf> = new BehaviorSubject<Erc20BalanceOf>({balance: "0"});
  constructor(private web3Service: Web3Service) {}
  /** コンテンツ */
  get erc20$() {
    return this._erc20$.asObservable();
  }
  get erc20() {
    return this._erc20$.getValue();
  }
  next(erc20: Erc20BalanceOf) {
    this._erc20$.next(erc20);
  }
  clear() {
    this._erc20$.next({balance: "0"});
  }

  /**以下web3からの取得 *ABIファイルに依存しているためmanualだと動かない可能性あり */

    /**
   * ERC20トークン情報を取得する
   * @param _address 検索するアドレス
   */
    async fetch(_address: string) {
      try {
        const result = await this.getErc20Balance(_address);
        if (!!result) {
          this.next(result);
        } else {
          this.next({ balance: "0"});
        }
      } catch (e) {
        this.clear();
        throw e;
      }
    }
  
  
  async getErc20Balance(
    _address: string
  ): Promise<Erc20BalanceOf | null> {
    try {
      const balance: Erc20BalanceOf =
        await this.web3Service.balanceOf(_address);
      return balance;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 桁数変換処理
   */
  /** 
   * 最小単位(ex. wei)から一般的単位(ex. ether)に変換する
   */
  toBaseUnit(value: string | undefined="", digits: number = 18): string {
    // TODO: digitsに合わせて桁変換できるように拡張する
    if (value === "") {
      return "";
    }
    try {
      return this.web3Service.web3.utils.fromWei(value, 'ether');
    } catch(e) {
      return "";
    }
  }

  /** 
   * 一般的単位(ex. ether)から最小単位(ex. wei)に変換する
   */
  fromBaseUnit(value: string | undefined = "", digits: number=18) : string {
    // TODO: digitsに合わせて桁変換できるように拡張する
    if (value === "") {
      return "";
    }
    try {
      return this.web3Service.web3.utils.toWei(value, 'ether');
    } catch(e) {
      return "";
    }
  }
}
