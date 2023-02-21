import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ContentService } from 'src/app/services/content/content.service';
import { AppService } from 'src/app/services/app/app.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Web3Service } from 'src/app/services/web3/web3.service';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { KeyService } from 'src/app/services/key/key.service';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contract } from 'src/app/models/models.types';

@Component({
  selector: 'app-contract-select',
  templateUrl: './contract-select.component.html',
  styleUrls: ['./contract-select.component.scss'],
})
export class ContractSelectComponent implements OnInit {
  selectedAddress = new FormControl(null); // 選択したアドレス
  selectedName = '';
  contractServiceList: Contract[] = [];
  inputAddress = new FormControl(null); // 手動入力したアドレス
  inputName = new FormControl(null); // 手動入力した名前
  address = '';
  email = '';

  constructor(
    private router: Router,
    private web3Service: Web3Service,
    private appService: AppService,
    private keyService: KeyService,
    private storageService: StorageService,
    private contentService: ContentService,
    private authService: AuthService,
    private confirmDialog: ConfirmDialogService,
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar,
  ) {}
  async ngOnInit(): Promise<void> {
    this.address = (await this.storageService.getWalletAddress()) ?? '';
    this.email = await this.keyService.getDecryptEmailAddress();
    await this.contractSelected();
  }

  async contractSelected(): Promise<void> {
    this.contractServiceList = await this.storageService.getContractList();
    //既に選択が行われている時の処理
    const existingContract = await this.storageService.getContractAddress();
    if (existingContract) {
      this.selectedAddress.setValue(existingContract);
      this.selectedName = (await this.storageService.getContractName()) ?? '';
    }
  }

  selected(_selectedName: string): void {
    this.selectedName = _selectedName;
  }

  async send(): Promise<void> {
    //各種設定の書き換え
    const contract = this.appService.getContractJsonObject('manual');
    const address = this.selectedAddress.value;
    const name = this.selectedName;
    this.contentService.clear();
    try {
      this.web3Service.changeContract(
        contract?.token.abi,
        contract?.token.address,
        contract?.content.abi,
        address
      );
      this.appService.setContractServiceName('manual');
      await this.storageService.setContractService('manual');
      await this.storageService.setContractAddress(address);
      await this.storageService.setContractName(name);
      this.router.navigate(['content-nft-list']);
    } catch {
      await this.confirmDialog.openComplete('The input address is incorrect');
    }
  }

  async addContract(): Promise<void> {
    const address = this.inputAddress.value;
    const name = this.inputName.value;
    const contract = { address, name };
    const contractJson = this.appService.getContractJsonObject('manual');
    const alreadyUse = this.contractServiceList.find(
      (contract) => contract.address === address || contract.name === name
    );
    if (alreadyUse) {
      await this.confirmDialog.openComplete(
        'This contract address or name is already registered'
      );
      return;
    }
    try {
      this.web3Service.changeContract(
        contractJson?.token.abi,
        contractJson?.token.address,
        contractJson?.content.abi,
        address
      );
      this.appService.setContractServiceName('manual');
      await this.storageService.setContractService('manual');
      await this.storageService.setContractAddress(address);
      await this.storageService.setContractName(name);
      this.contractServiceList.push(contract);
      await this.storageService.setContractList(this.contractServiceList);
      await this.contractSelected();
      this.inputAddress.setValue(null);
      this.inputName.setValue(null);
      await this.confirmDialog.openComplete('Contract address added');
    } catch {
      await this.confirmDialog.openComplete('The input address is incorrect');
    }
  }

  async logout() {
    await this.authService.logOut();
  }

  // ウォレットアドレスをコピー
  copyWalletAddress() {
    const decryptKey = this.address;
    this._clipboardService.copy(decryptKey);
    // snackBar表示
    this.openSnackBar('Copied your wallet address.');
  }

  // ラジオボタン切り替え時処理
  switchInputType(type: string) {
    if (type === 'select') {
      this.selectedAddress.enable();
      this.inputAddress.disable();
      this.inputName.disable();
    } else {
      this.selectedAddress.disable();
      this.inputAddress.enable();
      this.inputName.enable();
    }
  }

  // sendボタンのdisabled判定
  get selectIsValid() {
    const res = this.selectedAddress.value ? true : false;
    return res;
  }
  // addボタンのdisabled判定
  get formIsValid() {
    const res = this.inputAddress.value && this.inputName.value ? true : false;
    return res;
  }

  // スナックバー
  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000, // 2s
      panelClass: ['blue-snackbar'],
      verticalPosition: 'bottom',
    });
  }
}
