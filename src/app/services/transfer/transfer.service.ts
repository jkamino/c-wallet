import { Injectable } from '@angular/core';
import { Web3Service } from '../web3/web3.service';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private _toAddress: string;
  private _amount: string;
  private _balance: string;
  constructor(private web3Service: Web3Service) {
    this._toAddress = "";
    this._amount = "";
    this._balance = "";
  }

  get toAddress(): string {
    return this._toAddress;
  }

  set toAddress(address: string) {
    this._toAddress = address;
  }

  get amount(): string {
    return this._amount;
  }

  set amount(amount: string) {
    this._amount = amount;
  }

  get balance(): string {
    return this._balance;
  }

  set balance(balance: string) {
    this._balance = balance;
  }
  /**
   *NFT転送
   * @param address ウォレットアドレス
   * @param privateKey 秘密鍵
   * @param from ウォレットアドレス
   * @param to 送り先
   * @param objectId 対象コンテンツ
   * @returns
   */
  async objectTransfer(
    address: string,
    privateKey: string,
    from: string,
    to: string,
    objectId: number
  ): Promise<string | boolean> {
    try {
      const transactionHash = await this.web3Service.objectTransferFrom(
        address,
        privateKey,
        from,
        to,
        objectId
      );
      if (transactionHash) {
        return transactionHash as string;
      } else {
        return false;
      }
    } catch (e) {
      throw(e);
    }
  }

    /**
   *ERC20トークン転送
   * @param address ウォレットアドレス
   * @param privateKey 秘密鍵
   * @param to 送り先
   * @param value 送信額
   * @returns
   */
   async erc20Transfer(
    address: string,
    privateKey: string,
    to: string,
    value: string
  ): Promise<string | boolean> {
    try {
      const transactionHash = await this.web3Service.erc20TokenTransfer(
        address,
        privateKey,
        to,
        value
      );
      if (transactionHash) {
        return transactionHash as string;
      } else {
        return false;
      }
    } catch (e) {
      throw(e);
    }
  }
}
