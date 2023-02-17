import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
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
  constructor(
    private dialogRef: MatDialogRef<
    SelectAddressDialogComponent,
      string | undefined
    >,
    private fb: FormBuilder,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    
  }
  async select(): Promise<void> {
    this.dialogRef.close();
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
