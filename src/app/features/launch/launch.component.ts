import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.scss'],
})
export class LaunchComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    if (await this.authService.isAuth()) {
      this.router.navigate(['contract-select']);
    }
  }

  start() {
    this.router.navigate(['select-wallet']);
  }
}
