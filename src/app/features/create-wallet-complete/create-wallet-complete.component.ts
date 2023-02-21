import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { KeyService } from 'src/app/services/key/key.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { IClipboardResponse } from 'src/app/models/models.types';
import { RouterService } from 'src/app/services/router/router.service';
import { FooterService } from 'src/app/shared/components/footer/footer.component';

@Component({
  selector: 'app-create-wallet-complete',
  templateUrl: './create-wallet-complete.component.html',
  styleUrls: ['./create-wallet-complete.component.scss'],
})
export class CreateWalletCompleteComponent implements OnInit {
  //@dev 開発時はここに値を入れてください
  address!: string;
  privateKey!: string;
  id = '';
  show: boolean; // secret keyを表示するかどうか

  constructor(
    private router: Router,
    private storageService: StorageService,
    private routerService: RouterService,
    private keyService: KeyService,
    private footerService: FooterService,
    private _snackBar: MatSnackBar,
    private _clipboardService: ClipboardService
  ) {
    this.show = false;
    this.privateKey = this.keyService.getMemoryKey() ?? '';
  }

  async ngOnInit(): Promise<void> {
    this.address = (await this.storageService.getWalletAddress()) ?? '';
    this.id = this.keyService.getMemoryEmailAddress() ?? '';
    if (!this.address || !this.privateKey || !this.id) {
      this.routerService.setPreviousUrl(this.router.url);
      this.router.navigate(['/create-wallet']);
    }
  }

  // コピー成功
  copied(e: IClipboardResponse) {
    if (e.isSuccess) {
      // snackBar表示
      this.openSnackBar('Copied the address.');
    }
  }

  // 秘密鍵の表示切り替え
  switchShow() {
    this.show = this.show === true ? false : true;
    return;
  }

  // 秘密鍵の表示
  arrayFromPrivateKeyLength(len: number): string {
    let text = '';
    for (let i = 0; i < len; i++) {
      text = text + '*';
    }
    return text;
  }

  /**
   * 秘密鍵をコピー
   */
  copyPrivateKey() {
    const decryptKey = this.privateKey;
    this._clipboardService.copy(decryptKey);
    // snackBar表示
    this.openSnackBar('Copied the secret key.');
  }

  // スナックバー
  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000, // 2s
      panelClass: ['blue-snackbar'],
      verticalPosition: 'bottom',
    });
  }

  // 確認ボタンを押下
  confirmed() {
    this.footerService.show();
    this.router.navigate(['/contract-select']);
  }
}
