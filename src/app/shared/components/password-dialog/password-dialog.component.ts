import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss'],
})
export class PasswordDialogComponent {
  form: FormGroup = this.fb.group({
    password: [null, [Validators.required, Validators.minLength(8)]],
  });
  constructor(
    private dialogRef: MatDialogRef<
      PasswordDialogComponent,
      string | undefined
    >,
    private fb: FormBuilder
  ) {}

  done(): void {
    const password = this.form.getRawValue().password;
    this.dialogRef.close(password);
  }
}
@Injectable({
  providedIn: 'root',
})
export class PasswordDialogService {
  constructor(private dialog: MatDialog) {}
  /** dialog open */
  async open(): Promise<string | undefined> {
    const ref = this.dialog.open(PasswordDialogComponent, {
      width: '90%',
      maxWidth: '390px',
      height: '270px',
    });
    const res = await firstValueFrom(ref.afterClosed());
    return res;
  }
}
