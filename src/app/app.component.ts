import { Platform } from '@angular/cdk/platform';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './services/app/app.service';
import { StorageService } from './services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'C-Wallet';
  loaded: Observable<boolean> | null = null;
  isShow = false;
  get isMobile() {
    return this.platform.ANDROID || this.platform.IOS;
  }
  constructor(
    private appService: AppService,
    private storageService: StorageService,
    private platform: Platform
  ) {
    this.loaded = this.appService.loaded$;
  }
  async ngOnInit() {
    this.appService.init();
    this.loaded?.subscribe(() => {
      this.isShow = true;
    });
  }
  async ngOnDestroy(): Promise<void> {
    await this.storageService.clearTransactionHash();
  }
}
