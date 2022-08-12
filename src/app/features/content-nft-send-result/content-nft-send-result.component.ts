import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyService } from 'src/app/services/key/key.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-content-nft-send-result',
  templateUrl: './content-nft-send-result.component.html',
  styleUrls: ['./content-nft-send-result.component.scss'],
})
export class ContentNftSendResultComponent implements OnInit {
  transactionNo: string | null = '';
  walletAddress = '';
  email = '';
  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private appService: AppService,
    private keyService: KeyService,
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar
  ) {}
  async ngOnInit(): Promise<void> {
    this.walletAddress = (await this.storageService.getWalletAddress()) ?? '';
    this.email = await this.keyService.getDecryptEmailAddress();
    this.transactionNo = await this.storageService.getTransactionHash();
    if (!this.transactionNo) {
      this.router.navigate(['/content-nft-list']);
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
}
