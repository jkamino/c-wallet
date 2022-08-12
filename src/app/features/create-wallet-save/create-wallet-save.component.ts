import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeyService } from 'src/app/services/key/key.service';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { RouterService } from 'src/app/services/router/router.service';

@Component({
  selector: 'app-create-wallet-save',
  templateUrl: './create-wallet-save.component.html',
  styleUrls: ['./create-wallet-save.component.scss'],
})
export class CreateWalletSaveComponent implements OnInit {
  //@dev 開発時はここに値を入れてください
  privateKey!: string;
  show: boolean; // secret keyを表示するかどうか
  constructor(
    private router: Router,
    private routerService: RouterService,
    private confirmDialog: ConfirmDialogService,
    private keyService: KeyService,
    private _snackBar: MatSnackBar,
    private _clipboardService: ClipboardService
  ) {
    this.show = false;
    this.privateKey = this.keyService.getMemoryKey() ?? '';
  }

  async ngOnInit(): Promise<void> {
    if (!this.privateKey) {
      this.routerService.setPreviousUrl(this.router.url);
      this.router.navigate(['/create-wallet']);
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
  async done() {
    const res = await this.confirmDialog.openConfirm(
      'Install the secret key to your device?'
    );
    if (res) {
      this.router.navigate(['create-wallet-complete']);
    }
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
}
