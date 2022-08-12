import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentObject, Web3ContentSpec } from 'src/app/models/models.types';
import { ContentService } from 'src/app/services/content/content.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferService } from 'src/app/services/transfer/transfer.service';
import { CryptService } from 'src/app/services/crypt/crypt.service';
import { KeyService } from 'src/app/services/key/key.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppService } from 'src/app/services/app/app.service';
import { PasswordDialogService } from 'src/app/shared/components/password-dialog/password-dialog.component';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { ImageFileService } from 'src/app/services/image-file/image-file.service';
@Component({
  selector: 'app-content-nft-send',
  templateUrl: './content-nft-send.component.html',
  styleUrls: ['./content-nft-send.component.scss'],
})
export class ContentNftSendComponent implements OnInit {
  addressForm: FormGroup = this.fb.group({
    address: [null, [Validators.required]],
  });
  // passwordForm: FormGroup = this.fb.group({
  //   password: [null, [Validators.required]],
  // });
  //表示制御
  serviceName = '';
  walletAddress = '';
  email = '';
  showMore = false;
  contentObject!: ContentObject;
  imageSource: any | null = null;
  contentSpec!: Web3ContentSpec;
  mediaIdUrl = environment.ipfsUrl;
  constructor(
    private fb: FormBuilder,
    private confirmDialog: ConfirmDialogService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private storageService: StorageService,
    private appService: AppService,
    private contentService: ContentService,
    private cryptService: CryptService,
    private keyService: KeyService,
    private transferService: TransferService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private passwordDialog: PasswordDialogService,
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar,
    private imageFileService: ImageFileService
  ) {}
  async ngOnInit(): Promise<void> {
    this.walletAddress = (await this.storageService.getWalletAddress()) ?? '';
    this.serviceName = await this.appService.getContractServiceName();
    this.email = await this.keyService.getDecryptEmailAddress();
    const objectId = this.activeRoute.snapshot.params['objectId'];
    this.spinner.show();
    try {
      const content = await this.contentService.getContentObjectByAddress(
        objectId,
        this.walletAddress
      );
      if (content) {
        this.contentObject = content;
        const contentSpec = content.spec;
        if (contentSpec) {
          this.contentSpec = contentSpec;
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
      }
    } catch (e: any) {
      this.spinner.hide();
      if(e.error.message === 'timeOut'){
        await this.confirmDialog.openComplete('time out error occurred. back to Content NFT list.');
      }else{
        await this.confirmDialog.openComplete('error occurred. back to Content NFT list.');
      }
      this.router.navigate(['/content-nft-list']);
    }
  }
  onImgError() {
    this.mediaIdUrl = environment.ipfsUrl + this.contentSpec?.mediaId;
    this.imageSource = this.mediaIdUrl;
  }
  // ウォレットアドレスをコピー
  copyWalletAddress() {
    const decryptKey = this.walletAddress;
    this._clipboardService.copy(decryptKey);
    // snackBar表示
    this.openSnackBar('Copied your wallet address.');
  }

  async logout() {
    await this.authService.logOut();
  }

  back() {
    const objectId = this.activeRoute.snapshot.params['objectId'];
    this.router.navigate([`/content-nft-detail/${objectId}`]);
  }

  async send() {
    const password = await this.passwordDialog.open();

    if (!password) {
      return;
    }
    const address = this.addressForm.getRawValue().address;
    // const password = this.passwordForm.getRawValue().password;
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
    const objectId = this.contentObject?.objectId;
    const res = await this.confirmDialog.openConfirm(
      'Are you sure you want to send?'
    );
    if (res) {
      this.spinner.show();
      try{
        const transactionHash = await this.transferService.objectTransfer(
          this.walletAddress,
          decryptedPrivateKey,
          this.walletAddress,
          address,
          objectId
        );
        if (transactionHash) {
          await this.storageService.setTransactionHash(transactionHash as string);
          this.router.navigate(['/content-nft-send-result']);
        } else {
          await this.confirmDialog.openComplete('error occurred');
        }
      }catch(e: any){
        if(e.error.message === 'timeOut'){
          await this.confirmDialog.openComplete('time out error occurred');
        }else{
          await this.confirmDialog.openComplete('error occurred');
        }
      }
      this.spinner.hide();
    }
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
