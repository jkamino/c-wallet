import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AddressBook } from 'src/app/models/models.types';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-select-address-dialog',
  templateUrl: './select-address-dialog.component.html',
  styleUrls: ['./select-address-dialog.component.scss']
})
export class SelectAddressDialogComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: [null, [Validators.required]],
  });
  addressBookList: AddressBook[] = [];
  constructor(
    private dialogRef: MatDialogRef<
    SelectAddressDialogComponent,
      string | undefined
    >,
    private fb: FormBuilder,
    private storageService: StorageService,
  ) {}

  async ngOnInit(): Promise<void> {
    const walletAddress = await this.storageService.getWalletAddress() ?? '';
    const wholeAddressBookList = await this.storageService.getAddressBookList(walletAddress);

    this.addressBookList = wholeAddressBookList
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  async select(): Promise<void> {
    this.dialogRef.close();
  }

  async done(response: string) : Promise<void> {
    this.dialogRef.close(response);
  }
}
@Injectable({
  providedIn: 'root',
})
export class SelectAddressDialogService {
  constructor(private dialog: MatDialog) {}
  /** dialog open */
  async open(): Promise<string | undefined> {
    const ref = this.dialog.open(SelectAddressDialogComponent, {
      width: '90%',
      maxWidth: '390px',
      height: '270px'
    });
    const res = await firstValueFrom(ref.afterClosed());
    return res;
  }}
