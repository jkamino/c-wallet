/**
 * コントラクトの読み込み,メールアドレスなどアプリに関するもの
 * ABIファイルの読み込み先を変更する場合はここを変更すること
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { Web3Service } from '../web3/web3.service';
import { environment } from 'src/environments/environment';
//contract abi json files
const ManualTokenManagerJson = require('../../config/abi/manual/TokenManager.json');
const ManualDigitalContentObjectJson = require('../../config/abi/manual/DigitalContentObject.json');
const ManulaErc20ObjectJson = require('../../config/abi/manual/Transburn.json');

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _loaded$: Subject<boolean> = new Subject<boolean>();
  /**コントラクトの返却JSONの設定
   * @dev サービスを増やす場合はここを操作
   * manual設定用のファイル定義は必ず'manual'で行う
   */
  private contractMach = [
    {
      name: 'manual',
      jsons: {
        token: ManualTokenManagerJson,
        content: ManualDigitalContentObjectJson,
        erc20: ManulaErc20ObjectJson,
      },
    },
  ];
  /**選択中のコントラクトサービス名 */
  private contractServiceName = '';
  get loaded$() {
    return this._loaded$.asObservable();
  }
  constructor(
    private storageService: StorageService,
    private web3Service: Web3Service
  ) {}

  loaded() {
    this._loaded$.next(true);
  }
  //既にサービスを選択していた場合
  async init() {
    // ERC20トークンコントラクトは固定
    const manualContract = this.getContractJsonObject('manual');
    this.web3Service.setErc20Contract(
      manualContract?.erc20.abi,
      environment.erc20TokenContractAddress
    );

    const existingContract = await this.storageService.getContractService();
    if (existingContract) {
      this.contractServiceName = existingContract;
      const contract = this.getContractJsonObject(existingContract);
      const manualAddress = await this.storageService.getContractAddress();
      this.web3Service.changeContract(
        contract?.token.abi,
        contract?.token.address,
        contract?.content.abi,
        manualAddress
      );
      this.loaded();
    } else {
      this.loaded();
    }
  }

  getContractJsonObject(
    _serviceName: string
  ): { token: any; content: any; erc20: any } | undefined {
    const result = this.contractMach.find(
      (object) => object.name === _serviceName
    )?.jsons;
    return result;
  }

  setContractServiceName(_selectedName: string): void {
    this.contractServiceName = _selectedName;
  }

  async getContractServiceName(): Promise<string> {
    //manual入力かの判定
    if (this.contractServiceName === 'manual') {
      return (await this.storageService.getContractName()) ?? 'manual';
    } else {
      return this.contractServiceName;
    }
  }
}
