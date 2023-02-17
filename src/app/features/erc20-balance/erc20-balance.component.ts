import { Component, OnInit } from '@angular/core';
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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mirai-balance',
  templateUrl: './erc20-balance.component.html',
  styleUrls: ['./erc20-balance.component.scss']
})
export class Erc20BalanceComponent implements OnInit {
  //表示制御
  serviceName = '';
  walletAddress = '';
  email = '';
  showMore = false;
  erc20Balance$! : Observable<Erc20BalanceOf | undefined>
  isError = false;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private confirmDialog: ConfirmDialogService,
    private erc20Service: Erc20Service,
    private transferService: TransferService,
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

  // 購入画面へ遷移
  async goMarket() {
    const res = await this.confirmDialog.openConfirm('The external market will be opened in another tab. OK?');
    if(res) {
      window.open(environment.erc20TokenMarketUrl);
    }
  }
    
  // 送信画面へ遷移
  goTransfer() {
    this.router.navigate(['/mirai-transfer']);
  }
  // 桁数を揃える
  setDigit(value: string) {
    return this.erc20Service.convertToBaseUnit(value);
  }
  // テスト転送
  async getMirai(value: string) {
    console.log("transfer start");
    this.spinner.show();

    try{
      const transactionHash = await this.transferService.erc20Transfer(
        '0xCeeaa92c57A95E4bacCF2c6590f24E811AEE3f63',
        '0x88815bbcdc903b499bd2ec51e2acf4d00dace7a7e31badcd80beb2900ceb78a8',
        '0x598e289A63A1DC7aB1cfc3289eA8780ADa45e5F5',
        '1000000000000000000'
      );
      if (transactionHash) {
        // await this.storageService.setTransactionHash(transactionHash as string);
        // this.router.navigate(['/content-nft-send-result']);
        await this.erc20Service.fetch(this.walletAddress);
        console.log("transfer completed.");
      } else {
        await this.confirmDialog.openComplete('error occurred');
      }
      this.spinner.hide();
    }catch(e: any){
      if(e.error.message === 'timeOut'){
        await this.confirmDialog.openComplete('time out error occurred');
      }else{
        await this.confirmDialog.openComplete('error occurred');
      }
      this.spinner.hide();
    }

  }

}
