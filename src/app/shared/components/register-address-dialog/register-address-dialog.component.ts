import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AddressBook } from 'src/app/models/models.types';
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
    address: [null, [Validators.required]],
  });
  address: string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {address: any},
    private dialogRef: MatDialogRef<
      RegisterAddressDialogComponent,
      string | undefined
    >,
    private fb: FormBuilder,
    private storageService: StorageService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.form.setValue({name : "", address : data.address});
    this.form.controls['address'].disable();
  }

  async done(): Promise<void> {
    const _walletAddress = await this.storageService.getWalletAddress() ?? '';
    const _name = this.form.getRawValue().name;
    if (_walletAddress === '' || _name === '') {
      return;
    }
    const _addressBookList = await this.storageService.getAddressBookList(_walletAddress) || [];
    const _registerd = _addressBookList
      .find((address) => address.address === this.data.address);
    if(!!_registerd) {
      this.confirmDialogService.openComplete("This Address is already registerd.");
    } else {
      const _newAddressBook: AddressBook = {
        owner: _walletAddress,
        name: _name,
        address: this.data.address
      }
      await this.storageService.addAddressBook(_newAddressBook,);
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
