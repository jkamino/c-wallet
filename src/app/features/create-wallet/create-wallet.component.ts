import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ETHAccount } from 'src/app/models/models.types';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CryptService } from 'src/app/services/crypt/crypt.service';
import { KeyService } from 'src/app/services/key/key.service';
import { RouterService } from 'src/app/services/router/router.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Web3Service } from 'src/app/services/web3/web3.service';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss'],
})
export class CreateWalletComponent implements OnInit {
  form: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [
      null,
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$'),
      ],
    ],
    confirm: [null, [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private web3Service: Web3Service,
    private storageService: StorageService,
    private cryptService: CryptService,
    private confirmDialog: ConfirmDialogService,
    private keyService: KeyService,
    private authService: AuthService,
    private routerService: RouterService
  ) {}

  async ngOnInit(): Promise<void> {
    const previousUrl = this.routerService.getPreviousUrl();
    if (
      previousUrl === '/create-wallet-save' ||
      previousUrl === '/create-wallet-complete'
    ) {
      await this.confirmDialog.openComplete(
        'A reload has been detected. Please recreate your account.'
      );
    }
  }

  // アドレス作成
  async createAddress() {
    const _password = this.form.getRawValue().password;
    const _confirmPassword = this.form.getRawValue().confirm;
    const password = this.keyService.checkConfirmPassword(
      _password,
      _confirmPassword
    );
    const _email = this.form.getRawValue().email;
    if (!password) {
      this.confirmDialog.openComplete('Confirmation password do not match');
      return;
    }
    const sameCheck = await this.authService.checkSameEmail(_email, password);
    if (sameCheck) {
      this.confirmDialog.openComplete('Email address already used');
      return;
    }
    //アカウント作成
    const ethAccount: ETHAccount = await this.web3Service.createAddress();
    await this.storageService.setWalletAddress(ethAccount.address);
    this.keyService.setMemoryKey(ethAccount.privateKey);
    const encryptedPrivateKey = this.cryptService.encryption(
      ethAccount.privateKey,
      password
    );
    await this.storageService.setPrivateKey(encryptedPrivateKey);
    const encryptedEmailAddress = this.cryptService.encryption(
      _email,
      ethAccount.address
    );
    this.keyService.setMemoryEmailAddress(_email);
    await this.storageService.setEmailAddress(encryptedEmailAddress);
    this.router.navigate(['create-wallet-save']);
  }
}
