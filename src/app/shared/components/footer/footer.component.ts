import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(
    private router: Router,
    private footerService: FooterService,
    private storageService: StorageService
  ) {}

  // 表示判定
  get visible() {
    return this.footerService.visible;
  }
  // NFT画面に遷移
  async goNft() {
    const existingContract = await this.storageService.getContractAddress();
    if (existingContract) {
      this.router.navigate(['/content-nft-list']);
    } else {
      this.router.navigate(['/contract-select']);
    }
  }
  // Mirai画面に遷移
  goMirai() {
    this.router.navigate(['/mirai-balance']);
  }
}

@Injectable({providedIn: 'root'})
export class FooterService {
  visible = false;
  constructor() {
    this.visible = false;
  }
  hide() {
    this.visible = false;
  }
  show() {
    this.visible = true;
  }
}
