import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWalletCompleteComponent } from './features/create-wallet-complete/create-wallet-complete.component';
import { ContentNftListComponent } from './features/content-nft-list/content-nft-list.component';
import { ContractSelectComponent } from './features/contract-select/contract-select.component';
import { CreateWalletComponent } from './features/create-wallet/create-wallet.component';
import { LaunchComponent } from './features/launch/launch.component';
import { SelectWalletComponent } from './features/select-wallet/select-wallet.component';
import { CreateComponent } from './features/create/create.component';
import { ContentNftDetailComponent } from './features/content-nft-detail/content-nft-detail.component';
import { CreateBySecretKeyComponent } from './features/create-by-secret-key/create-by-secret-key.component';
import { ContentNftSendResultComponent } from './features/content-nft-send-result/content-nft-send-result.component';
import { ContentNftSendComponent } from './features/content-nft-send/content-nft-send.component';
import { AuthGuard } from './guard/auth.guard';
import { CreateWalletSaveComponent } from './features/create-wallet-save/create-wallet-save.component';
import { LoginByPasswordComponent } from './features/login-by-password/login-by-password.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LaunchComponent,
  },
  {
    path: 'select-wallet',
    pathMatch: 'full',
    component: SelectWalletComponent,
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateComponent,
  },
  {
    path: 'create-by-secret-key',
    pathMatch: 'full',
    component: CreateBySecretKeyComponent,
  },
  {
    path: 'create-wallet',
    pathMatch: 'full',
    component: CreateWalletComponent,
  },
  {
    path: 'create-wallet-save',
    pathMatch: 'full',
    component: CreateWalletSaveComponent,
  },
  {
    path: 'create-wallet-complete',
    pathMatch: 'full',
    component: CreateWalletCompleteComponent,
  },
  {
    path: 'contract-select',
    pathMatch: 'full',
    component: ContractSelectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login-by-password',
    pathMatch: 'full',
    component: LoginByPasswordComponent,
  },
  {
    path: 'content-nft-list',
    pathMatch: 'full',
    component: ContentNftListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'content-nft-detail/:objectId',
    pathMatch: 'full',
    component: ContentNftDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'content-nft-send/:objectId',
    pathMatch: 'full',
    component: ContentNftSendComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'content-nft-send-result',
    pathMatch: 'full',
    component: ContentNftSendResultComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
