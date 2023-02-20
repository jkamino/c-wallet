import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

    // NFT画面に遷移
    goNft() {
      this.router.navigate(['/content-nft-list']);
    }
    // Mirai画面に遷移
    goMirai() {
      this.router.navigate(['/mirai-balance']);
    }
  
}
