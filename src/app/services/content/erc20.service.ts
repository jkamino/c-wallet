import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BurnRate, Erc20BalanceOf } from 'src/app/models/models.types';
import { Web3Service } from '../web3/web3.service';

@Injectable({
  providedIn: 'root',
})
export class Erc20Service {
  private _balance$: BehaviorSubject<Erc20BalanceOf> =
    new BehaviorSubject<Erc20BalanceOf>({ balance: '0' });
  private _burnRate$: BehaviorSubject<BurnRate> = new BehaviorSubject<BurnRate>(
    { burnRate: '0' }
  );
  constructor(private web3Service: Web3Service) {}

  /** トークンバランス */
  get balance$() {
    return this._balance$.asObservable();
  }
  get balance() {
    return this._balance$.getValue();
  }
  nextBalance(balance: Erc20BalanceOf) {
    this._balance$.next(balance);
  }
  clearBalance() {
    this._balance$.next({ balance: '0' });
  }

  /** バーンレート */
  get burnRate$() {
    return this._burnRate$.asObservable();
  }

  get burnRate() {
    return this._burnRate$.getValue();
  }

  nextBurnRate(burnRate: BurnRate) {
    this._burnRate$.next(burnRate);
  }

  clearBurnRate() {
    this._burnRate$.next({ burnRate: '0' });
  }

  // BN変換
  toBN(_value: number | string) {
    return this.web3Service.toBN(_value);
  }

  // アドレスチェック
  isAddress(_address: string) {
    return this.web3Service.isAddress(_address);
  }

  /**以下web3からの取得 *ABIファイルに依存しているためmanualだと動かない可能性あり */

  /**
   * チェーンからERC20トークンの残高情報を取得し更新する
   * @param _address 検索するアドレス
   */
  async fetchBalance(_address: string) {
    try {
      const result = await this.getBalance(_address);
      if (!!result) {
        this.nextBalance(result);
      } else {
        this.clearBalance();
      }
    } catch (e) {
      this.clearBalance();
      throw e;
    }
  }

  async getBalance(_address: string): Promise<Erc20BalanceOf | null> {
    try {
      const balance: Erc20BalanceOf = await this.web3Service.balanceOf(
        _address
      );
      return balance;
    } catch (e) {
      throw e;
    }
  }

  /**
   * チェーンからトランスバーントークンのバーンレートを取得し更新する
   */
  async fetchBurnRate() {
    try {
      const result = await this.getBurnRate();
      if (!!result) {
        this.nextBurnRate(result);
      } else {
        this.clearBurnRate();
      }
    } catch (e) {
      this.clearBalance();
      throw e;
    }
  }

  async getBurnRate(): Promise<BurnRate | null> {
    try {
      const burnRate: BurnRate = await this.web3Service.getBurnRate();
      return burnRate;
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
  toBaseUnit(value: string | undefined = '', digits: number = 18): string {
    // TODO: digitsに合わせて桁変換できるように拡張する
    if (value === '') {
      return '';
    }
    try {
      return this.web3Service.web3.utils.fromWei(value, 'ether');
    } catch (e) {
      return '';
    }
  }

  /**
   * 一般的単位(ex. ether)から最小単位(ex. wei)に変換する
   */
  fromBaseUnit(value: string | undefined = '', digits: number = 18): string {
    // TODO: digitsに合わせて桁変換できるように拡張する
    if (value === '') {
      return '';
    }
    try {
      return this.web3Service.web3.utils.toWei(value, 'ether');
    } catch (e) {
      return '';
    }
  }
}
