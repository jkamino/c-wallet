import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddressBook } from 'src/app/models/models.types';
import { AppService } from 'src/app/services/app/app.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Erc20Service } from 'src/app/services/content/erc20.service';
import { CryptService } from 'src/app/services/crypt/crypt.service';
import { KeyService } from 'src/app/services/key/key.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TransferService } from 'src/app/services/transfer/transfer.service';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PasswordDialogService } from 'src/app/shared/components/password-dialog/password-dialog.component';
import { RegisterAddressDialogService } from 'src/app/shared/components/register-address-dialog/register-address-dialog.component';

@Component({
  selector: 'app-mirai-transfer-confirm',
  templateUrl: './erc20-transfer-confirm.component.html',
  styleUrls: ['./erc20-transfer-confirm.component.scss']
})
export class Erc20TransferConfirmComponent implements OnInit {
  //表示制御
  serviceName = '';
  walletAddress = '';
  email = '';
  toAddress = '';
  amount = '';
  balance = '';
  isError = false;
  addressBook : AddressBook | undefined = undefined;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private erc20Service: Erc20Service,
    private transferService: TransferService,
    private confirmDialog: ConfirmDialogService,
    private passwordDialog: PasswordDialogService,
    private registerAddressDialog: RegisterAddressDialogService,
    private appService: AppService,
    private authService: AuthService,
    private cryptService: CryptService,
    private spinner: NgxSpinnerService,
    private keyService: KeyService,
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar
  ) {
    
  }

  async ngOnInit(): Promise<void> {
    this.walletAddress = (await this.storageService.getWalletAddress()) ?? '';
    this.email = await this.keyService.getDecryptEmailAddress();
    this.serviceName = await this.appService.getContractServiceName();
    this.toAddress = this.transferService.toAddress;
    this.amount = this.transferService.amount;
    this.balance = this.transferService.balance;
    this.addressBook = (await this.storageService.getAddressBookList(this.walletAddress))
      .find((addressBook) => addressBook.address === this.toAddress);
  }

  // アドレスを登録
  async registerAddress() {
    await this.registerAddressDialog.open(this.toAddress);
    this.addressBook = (await this.storageService.getAddressBookList(this.walletAddress))
      .find((addressBook) => addressBook.address === this.toAddress);
  }
  async back() {
    this.router.navigate(['/mirai-transfer']);
  }
  async transfer() {

    const password = await this.passwordDialog.open();

    if (!password) {
      return;
    }
    const privateKey = (await this.storageService.getPrivateKey()) ?? '';
    //復号鍵はここでのみ使用する
    const decryptedPrivateKey = this.cryptService.decryption(
      privateKey,
      password
    );
    const checkPrivateKeyToAddress =
      await this.keyService.checkPrivateKeyToAddress(
        this.walletAddress,
        decryptedPrivateKey
      );
    if (!checkPrivateKeyToAddress) {
      this.confirmDialog.openComplete('Password is invalid');
      return;
    }


    try{
      this.spinner.show();
      // 転送
      const transactionHash = await this.transferService.erc20Transfer(
        this.walletAddress,
        decryptedPrivateKey,
        this.toAddress,
        this.amount
      );
      if (transactionHash) {
        // 成功時
        // トランザクション履歴を追加してストレージに保存
        const historyList = await this.storageService.getTransactionHisoryList() || [];
        historyList.push(transactionHash as string);
        await this.storageService.setTransactionHistoryList(historyList);
        // 送信後の残高を取得
        await this.erc20Service.fetch(this.walletAddress);
      } else {
        await this.confirmDialog.openComplete('error occurred');
      }
      await this.confirmDialog.openComplete("Transfer Completed!");
      this.router.navigate(['/mirai-balance']);

    }catch(e: any){
      if(e.error?.message === 'timeOut'){
        await this.confirmDialog.openComplete('time out error occurred');
      }else{
        await this.confirmDialog.openComplete('error occurred');
      }
    } finally {
      this.spinner.hide();
    }
  }
  async logout() {
    await this.authService.logOut();
  }

  // Transferボタンのdisabled判定
  get formIsValid() {
    const res = this.toAddress && this.amount ? true : false;
    return res;
  }
  // ウォレットアドレスをコピー
  copyWalletAddress() {
    const decryptKey = this.walletAddress;
    this._clipboardService.copy(decryptKey);
    // snackBar表示
    this.openSnackBar('Copied your wallet address.');
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
