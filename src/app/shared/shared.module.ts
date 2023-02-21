import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { PasswordDialogComponent } from './components/password-dialog/password-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { RegisterAddressDialogComponent } from './components/register-address-dialog/register-address-dialog.component';
import { SelectAddressDialogComponent } from './components/select-address-dialog/select-address-dialog.component';

@NgModule({
  declarations: [ConfirmDialogComponent, PasswordDialogComponent, RegisterAddressDialogComponent, SelectAddressDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule,
    MatInputModule,
    MatListModule,
    MatFormFieldModule,
    MatTableModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ConfirmDialogComponent,
    PasswordDialogComponent,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
})
export class SharedModule {}
