import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CryptService } from 'src/app/services/crypt/crypt.service';
import { KeyService } from 'src/app/services/key/key.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { FooterService } from 'src/app/shared/components/footer/footer.component';

@Component({
  selector: 'app-login-by-secret-key',
  templateUrl: './create-by-secret-key.component.html',
  styleUrls: ['./create-by-secret-key.component.scss'],
})
export class CreateBySecretKeyComponent {
  form: FormGroup = this.fb.group({
    secretKey: [null, [Validators.required]],
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
    private keyService: KeyService,
    private storageService: StorageService,
    private cryptService: CryptService,
    private authService: AuthService,
    private footerService: FooterService,
    private confirmDialog: ConfirmDialogService
  ) {}

  async login(): Promise<void> {
    const _password = this.form.getRawValue().password;
    const _confirmPassword = this.form.getRawValue().confirm;
    const _email = this.form.getRawValue().email;
    const password = this.keyService.checkConfirmPassword(
      _password,
      _confirmPassword
    );
    if (!password) {
      this.confirmDialog.openComplete('Confirmation password do not match');
      return;
    }
    const sameCheck = await this.authService.checkSameEmail(_email, password);
    if (sameCheck) {
      this.confirmDialog.openComplete('Email address already used');
      return;
    }
    const privateKey = this.form.getRawValue().secretKey;
    const address = await this.keyService.getAddressByPrivateKe(privateKey);
    if (!address) {
      this.confirmDialog.openComplete('Secret key is invalid.');
      return;
    }
    const checkPrivateKeyToAddress =
      await this.keyService.checkPrivateKeyToAddress(address, privateKey);
    if (checkPrivateKeyToAddress) {
      await this.storageService.setWalletAddress(address);
      const encryptedPrivateKey = this.cryptService.encryption(
        privateKey,
        password
      );
      await this.storageService.setPrivateKey(encryptedPrivateKey);
      const encryptedEmailAddress = this.cryptService.encryption(
        _email,
        address
      );
      await this.storageService.setEmailAddress(encryptedEmailAddress);
      this.footerService.show();
      this.router.navigate(['/contract-select']);
    } else {
      this.confirmDialog.openComplete(
        'Wallet address or private key is invalid'
      );
      return;
    }
  }
}
