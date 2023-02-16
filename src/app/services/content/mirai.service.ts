import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ContentObject,
  ContentObjectInfo,
  ContentObjectProduct,
  DigitalContentObject,
  DigitalContentSpec,
  Erc20BalanceOf,
  Web3ContentSpec,
} from 'src/app/models/models.types';
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
   * アドレスとオブジェクトIDでcontentを取得
   * @param _objectId objectId
   * @param _address オーナーのaddress
   * @returns
   */
  async getContentObjectByAddress(
    _objectId: number,
    _address: string
  ): Promise<ContentObject | null> {
    try {
      const content: DigitalContentObject =
        await this.web3Service.getDigitalContentObject(_objectId);
      //このシステムでは他のオーナーのオブジェクトを取得することはない
      if (content.object.owner === _address) {
        const contentSpec = await this.getContentSpecBySpecId(
          content.object.specId
        );
        if (contentSpec) {
          let objectInfo: any;
          try {
            objectInfo = JSON.parse(content.object.info);
          } catch {
            objectInfo = content.object.info;
            return {
              objectId: content.object.objectId,
              objectIndex: content.object.objectIndex,
              specId: content.object.specId,
              owner: content.object.owner,
              mediaId: content.object.mediaId,
              info: objectInfo,
              spec: contentSpec,
            };
          }
          if (!objectInfo.product) {
            const info = objectInfo as ContentObjectInfo;
            return {
              objectId: content.object.objectId,
              objectIndex: content.object.objectIndex,
              specId: content.object.specId,
              owner: content.object.owner,
              mediaId: content.object.mediaId,
              info: info,
              spec: contentSpec,
            };
          } else {
            const info = objectInfo as ContentObjectProduct;
            return {
              objectId: content.object.objectId,
              objectIndex: content.object.objectIndex,
              specId: content.object.specId,
              owner: content.object.owner,
              mediaId: content.object.mediaId,
              info: info.product,
              spec: contentSpec,
            };
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  /**
   * specIDからcontentSpecを入手
   * @param _specId specID
   * @returns
   */
  async getContentSpecBySpecId(
    _specId: number
  ): Promise<Web3ContentSpec | undefined> {
    try {
      const contentSpec: DigitalContentSpec =
        await this.web3Service.getDigitalContentSpec(_specId);
      return contentSpec.spec;
    } catch (e) {
      throw e;
    }
  }
  /**
   * コントラクト内のオブジェクトの所有数を取得
   * @param _address オーナーのaddress
   * @returns
   */
  async getObjectBalance(_address: string): Promise<number | undefined> {
    try {
      const balance = await this.web3Service.objectBalanceOf(_address);
      return Number(balance._ownedObjectsCount);
    } catch (e) {
      throw e;
    }
  }
  /**
   * コントラクト内の所有オブジェクトのobjectId一覧
   * @param _address
   * @returns
   */
  async getOwnedObjects(_address: string): Promise<number[] | undefined> {
    try {
      const objectIds = await this.web3Service.ownedObjectsOf(_address);
      return objectIds._ownedObjects;
    } catch (e) {
      throw e;
    }
  }
}
