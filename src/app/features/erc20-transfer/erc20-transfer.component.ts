import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Erc20BalanceOf } from 'src/app/models/models.types';
import { AppService } from 'src/app/services/app/app.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Erc20Service } from 'src/app/services/content/erc20.service';
import { KeyService } from 'src/app/services/key/key.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TransferService } from 'src/app/services/transfer/transfer.service';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { SelectAddressDialogService } from 'src/app/shared/components/select-address-dialog/select-address-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mirai-transfer',
  templateUrl: './erc20-transfer.component.html',
  styleUrls: ['./erc20-transfer.component.scss']
})
export class Erc20TransferComponent implements OnInit {
  //表示制御
  serviceName = '';
  walletAddress = '';
  email = '';
  erc20Balance$! : Observable<Erc20BalanceOf | undefined>
  toAddress = new FormControl(null); // 手動入力したアドレス
  amount = new FormControl(null); // 手動入力した名前
  isError = false;
  transactionHistoryList: string[] = [];
  explorerBaseUrl = environment.erc20ExplorerUrl + '/tx';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private erc20Service: Erc20Service,
    private transferService: TransferService,
    private selectAddressDialog: SelectAddressDialogService,
    private appService: AppService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private keyService: KeyService,
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.walletAddress = (await this.storageService.getWalletAddress()) ?? '';
    this.email = await this.keyService.getDecryptEmailAddress();
    this.serviceName = await this.appService.getContractServiceName();
    this.spinner.show();
    await this.erc20Service.fetch(this.walletAddress);
    this.erc20Balance$ = this.erc20Service.erc20$;
    this.transactionHistoryList = await this.storageService.getTransactionHisoryList() || [];
    this.spinner.hide();
  }

  async logout() {
    await this.authService.logOut();
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

  // アドレス選択ダイアログ表示
  async openAddressBook() {
    this.toAddress.setValue(await this.selectAddressDialog.open());
    
  }
  // 送信確認画面へ遷移
  async next() {
    // 値の受け渡し
    this.transferService.toAddress = this.toAddress.value;
    this.transferService.amount = this.erc20Service.fromBaseUnit(this.amount.value);
    this.transferService.balance = this.erc20Service.erc20.balance;
    this.router.navigate(['/mirai-transfer-confirm']);
  }
    
  // Nextボタンのdisabled判定
  get formIsValid() {
    const res = this.toAddress.value && this.amount.value ? true : false;
    return res;
  }

}
