import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-register-address-dialog',
  templateUrl: './register-address-dialog.component.html',
  styleUrls: ['./register-address-dialog.component.scss']
})
export class RegisterAddressDialogComponent {
  form: FormGroup = this.fb.group({
    name: [null, [Validators.required]],
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {address: any},
    private dialogRef: MatDialogRef<
      RegisterAddressDialogComponent,
      string | undefined
    >,
    private fb: FormBuilder,
    private storageService: StorageService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  async done(): Promise<void> {
    const name = this.form.getRawValue().name;
    const addressBook = await this.storageService.getAddressBook() || [];
    const registerd = addressBook.find((address) => address.address === this.data.address);
    if(registerd) {
      this.confirmDialogService.openComplete("This Address is already registerd.");
    } else {
      addressBook.push({name: name, address: this.data.address});
      this.storageService.setAddressBook(addressBook);
    }
    this.dialogRef.close();
  }
}
@Injectable({
  providedIn: 'root',
})
export class RegisterAddressDialogService {
  constructor(private dialog: MatDialog) {}
  /** dialog open */
  async open(_address: string): Promise<string | undefined> {
    const ref = this.dialog.open(RegisterAddressDialogComponent, {
      width: '90%',
      maxWidth: '390px',
      height: '270px',
      data: {address: _address}
    });
    const res = await firstValueFrom(ref.afterClosed());
    return res;
  }
}
