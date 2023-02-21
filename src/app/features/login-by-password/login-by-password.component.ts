import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { FooterService } from 'src/app/shared/components/footer/footer.component';

@Component({
  selector: 'app-login-by-password',
  templateUrl: './login-by-password.component.html',
  styleUrls: ['./login-by-password.component.scss'],
})
export class LoginByPasswordComponent {
  form: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private confirmDialog: ConfirmDialogService,
    private authService: AuthService,
    private footerService: FooterService
  ) {
    this.footerService.hide();
  }

  async login(): Promise<void> {
    const _password = this.form.getRawValue().password;
    const _email = this.form.getRawValue().email;
    try {
      const auth = await this.authService.logIn(_email, _password);
      if (auth) {
        this.router.navigate(['/contract-select']);
      } else {
        this.confirmDialog.openComplete(
          'Password or email address is invalid.'
        );
        return;
      }
    } catch {
      this.confirmDialog.openComplete(
        'Wallet information is missing, please set secret key'
      );
      return;
    }
  }
}
