import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/services/content/content.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentObject, Web3ContentSpec } from 'src/app/models/models.types';
import { ImageFileService } from 'src/app/services/image-file/image-file.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppService } from 'src/app/services/app/app.service';
import { KeyService } from 'src/app/services/key/key.service';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-content-nft-detail',
  templateUrl: './content-nft-detail.component.html',
  styleUrls: ['./content-nft-detail.component.scss'],
})
export class ContentNftDetailComponent implements OnInit {
  //表示制御
  serviceName = '';
  walletAddress = '';
  email = '';
  showMore = false;
  contentObject: ContentObject | null = null;
  imageSource: string | null = null;
  contentSpec: Web3ContentSpec | null = null;
  specInfo!: object;
  mediaIdUrl = environment.ipfsUrl;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private storageService: StorageService,
    private confirmDialog: ConfirmDialogService,
    private appService: AppService,
    private contentService: ContentService,
    private imageFileService: ImageFileService,
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
    const objectId = this.activeRoute.snapshot.params['objectId'];
    this.spinner.show();
    try {
      const content = await this.contentService.getContentObjectByAddress(
        objectId,
        this.walletAddress
      );
      if (content) {
        this.contentObject = content;
        this.contentSpec = content.spec;
        try {
          this.specInfo = JSON.parse(this.contentSpec.info);
        } catch {
          this.specInfo = { info: this.contentSpec.info };
        }
        // @dev 画像取得のロジック変更する場合はここも変更する
        try {
          const imageSource = await this.imageFileService.downloadFile(
            this.contentSpec.mediaId,
            this.walletAddress
          );
          this.imageSource = imageSource;
          //mediaIdUrlを固有のものに書き換え
          this.mediaIdUrl = environment.ipfsUrl + this.contentSpec.mediaId;
        } catch {
          this.onImgError();
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
        await this.confirmDialog.openComplete('error occurred. back to Content NFT list.');
        this.router.navigate(['/content-nft-list']);
        return;
      }
    } catch (e: any) {
      this.spinner.hide();
      if(e.error.message === 'timeOut'){
        await this.confirmDialog.openComplete('time out error occurred. back to Content NFT list.');
      }else{
        await this.confirmDialog.openComplete('error occurred. back to Content NFT list.');
      }
      this.router.navigate(['/content-nft-list']);
      return;
    }
  }
  onImgError() {
    this.mediaIdUrl = environment.ipfsUrl + this.contentSpec?.mediaId;
    this.imageSource = this.mediaIdUrl;
  }
  onClickMore() {
    this.showMore = !this.showMore;
  }

  async logout() {
    await this.authService.logOut();
  }

  typeCheck(_object: any) {
    return typeof _object;
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
