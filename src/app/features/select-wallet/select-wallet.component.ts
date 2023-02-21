import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FooterService } from 'src/app/shared/components/footer/footer.component';

@Component({
  selector: 'app-select-wallet',
  templateUrl: './select-wallet.component.html',
  styleUrls: ['./select-wallet.component.scss'],
})
export class SelectWalletComponent implements OnInit {
  ngOnInit(): void {
    this.footerService.hide();
  }

  constructor(private footerService: FooterService) {

  }
}
