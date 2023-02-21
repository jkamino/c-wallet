import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentObject } from 'src/app/models/models.types';
import { ContentService } from 'src/app/services/content/content.service';
import { AppService } from 'src/app/services/app/app.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyService } from 'src/app/services/key/key.service';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { FooterService } from 'src/app/shared/components/footer/footer.component';
@Component({
  selector: 'app-content-nft-list',
  templateUrl: './content-nft-list.component.html',
  styleUrls: ['./content-nft-list.component.scss'],
})
export class ContentNftListComponent implements OnInit {
  serviceName = '';
  walletAddress = '';
  email = '';
  contentObjects$!: Observable<ContentObject[] | null>;
  isError = false;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private appService: AppService,
    private contentService: ContentService,
    private confirmDialog: ConfirmDialogService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private keyService: KeyService,
    private footerService: FooterService,
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.walletAddress = (await this.storageService.getWalletAddress()) ?? '';
    this.serviceName = await this.appService.getContractServiceName();
    this.email = await this.keyService.getDecryptEmailAddress();
    this.footerService.show();
    this.spinner.show();
    try {
      await this.contentService.fetchData(this.walletAddress);
      this.contentObjects$ = this.contentService.contents$;
      this.spinner.hide();
    } catch(e: any) {
      this.isError = true;
      this.spinner.hide();
      if(e.error.message === 'timeOut'){
        await this.confirmDialog.openComplete('time out error occurred');
      }else{
        await this.confirmDialog.openComplete('error occurred');
      }
    }
  }

  goToDetail(objectId: number): void {
    this.router.navigate([`/content-nft-detail/${objectId}`]);
  }
  async logout() {
    await this.authService.logOut();
  }
  backTo() {
    this.router.navigate(['/contract-select']);
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
