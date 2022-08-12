import { Component, Inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; isConfirm: boolean }
  ) {}

  close() {
    this.dialogRef.close(false);
  }

  ok() {
    this.dialogRef.close(true);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}
  /** OK or Cancel */
  async openConfirm(message: string): Promise<boolean | undefined> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message, isConfirm: true },
      width: '90%',
      maxWidth: '390px',
      height: '220px',
    });
    const res = await firstValueFrom(ref.afterClosed());
    return res;
  }

  /** OK Only */
  async openComplete(message: string): Promise<boolean | undefined> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message, isConfirm: false },
      width: '90%',
      maxWidth: '390px',
      height: '220px',
    });
    const res = await firstValueFrom(ref.afterClosed());
    return res;
  }
}
