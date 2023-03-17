import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import {
  AddressBook,
  Erc20BalanceOf,
  TransferHistory,
} from 'src/app/models/models.types';
import { AppService } from 'src/app/services/app/app.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Erc20Service } from 'src/app/services/erc20/erc20.service';
import { KeyService } from 'src/app/services/key/key.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TransferService } from 'src/app/services/transfer/transfer.service';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { SelectAddressDialogService } from 'src/app/shared/components/select-address-dialog/select-address-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mirai-transfer',
  templateUrl: './erc20-transfer.component.html',
  styleUrls: ['./erc20-transfer.component.scss'],
})
export class Erc20TransferComponent implements OnInit {
  //表示制御
  serviceName = '';
  walletAddress = '';
  email = '';
  encryptedEmail = '';
  erc20Balance$!: Observable<Erc20BalanceOf | undefined>;
  transferForm: FormGroup;
  isError = false;
  transferHistoryList: TransferHistory[] = [];
  addressBookList: AddressBook[] = [];
  explorerBaseUrl = environment.erc20ExplorerUrl + '/tx';

  // Historyテーブルに表示する列
  displayedColumns: string[] = ['date', 'to', 'value', 'transaction-hash'];
  constructor(
    private router: Router,
    private storageService: StorageService,
    private erc20Service: Erc20Service,
    private transferService: TransferService,
    private selectAddressDialog: SelectAddressDialogService,
    private appService: AppService,
    private authService: AuthService,
    private confirmService: ConfirmDialogService,
    private spinner: NgxSpinnerService,
    private keyService: KeyService,
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.transferForm = this.fb.group({
      toAddress: ['', [Validators.required, this.isValidAddress()]],
      amount: ['', [Validators.required, this.isValidNumber()]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.walletAddress = (await this.storageService.getWalletAddress()) ?? '';
    this.email = await this.keyService.getDecryptEmailAddress();
    this.encryptedEmail = (await this.storageService.getEmailAddress()) ?? '';
    this.serviceName = await this.appService.getContractServiceName();
    this.spinner.show();
    try {
      await this.erc20Service.fetchBalance(this.walletAddress);
      this.erc20Balance$ = this.erc20Service.balance$;
      this.transferHistoryList = (
        await this.keyService.getDecryptedTransferHistoryList(
          this.encryptedEmail
        )
      ).sort((a, b) => b.dateTime - a.dateTime);
      this.addressBookList = await this.keyService.getDecryptedAddressBookList(
        this.encryptedEmail
      );
    } catch (e) {
      this.confirmService.openComplete('error occured!');
    } finally {
      this.spinner.hide();
    }
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
    this.transferForm.patchValue({
      toAddress: await this.selectAddressDialog.open(),
    });
  }
  // 送信確認画面へ遷移
  async next() {
    // 値の受け渡し
    this.transferService.toAddress = this.transferForm.getRawValue().toAddress;
    this.transferService.amount = this.erc20Service.fromBaseUnit(
      this.transferForm.getRawValue().amount
    );
    this.transferService.balance = this.erc20Service.balance.balance;
    if (
      !this.checkAmount(
        this.transferService.amount,
        this.transferService.balance
      )
    ) {
      this.confirmService.openComplete(
        'Amount must be between Zero and Balance!'
      );
      return;
    }
    this.router.navigate(['/mirai-transfer-confirm']);
  }

  // addressから対応するaddressBookのnameに変換する
  // addressBookにaddressが存在しなければそのままaddressを返す
  getNameFromAddress(_address: string): string {
    const addressbook = this.addressBookList.find(
      (addressBook) => addressBook.address === _address
    );
    return addressbook?.name ?? _address;
  }

  /**
   * Validator
   * amountが数字であることを確認する
   */
  isValidNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const numExp: RegExp = new RegExp('^(0|[1-9][0-9]*)(\\.[0-9]*[1-9])?$');
      return numExp.test(control.value)
        ? null
        : { invalidNumber: { number: control.value } };
    };
  }

  /**
   * 正しいアドレスであることを確認する
   * 現状はMirai(=ETH)形式のみ
   */
  isValidAddress(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.erc20Service.isAddress(control.value)
        ? null
        : { invalidAddress: { address: control.value } };
    };
  }
  /**
   * 0 < amout <= balanceであることを確認
   * 整数の比較しかできないため、必ず最小単位(例：wei)に変換してから呼び出すこと
   */
  checkAmount(_amount: string, _balance: string): boolean {
    try {
      const amountBN = this.erc20Service.toBN(_amount);
      const balanceBN = this.erc20Service.toBN(_balance);
      const zeroBN = this.erc20Service.toBN('0');
      return amountBN.gt(zeroBN) && amountBN.lte(balanceBN);
    } catch (e) {
      return false;
    }
  }
}
