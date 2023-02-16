import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LaunchComponent } from './features/launch/launch.component';
import { SelectWalletComponent } from './features/select-wallet/select-wallet.component';
import { CreateWalletComponent } from './features/create-wallet/create-wallet.component';
import { CreateComponent } from './features/create/create.component';
import { CreateWalletCompleteComponent } from './features/create-wallet-complete/create-wallet-complete.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContractSelectComponent } from './features/contract-select/contract-select.component';
import { ContentNftListComponent } from './features/content-nft-list/content-nft-list.component';
import { ContentNftDetailComponent } from './features/content-nft-detail/content-nft-detail.component';
import { CreateBySecretKeyComponent } from './features/create-by-secret-key/create-by-secret-key.component';
import { ContentNftSendComponent } from './features/content-nft-send/content-nft-send.component';
import { ContentNftSendResultComponent } from './features/content-nft-send-result/content-nft-send-result.component';
import { LoginByPasswordComponent } from './features/login-by-password/login-by-password.component';
// Third-party modules
import { NgxSpinnerModule } from 'ngx-spinner';
import { CreateWalletSaveComponent } from './features/create-wallet-save/create-wallet-save.component';
import { ClipboardModule } from 'ngx-clipboard';
import { Erc20BalanceComponent } from './features/erc20-balance/erc20-balance.component';
import { Erc20TransferComponent } from './features/erc20-transfer/erc20-transfer.component';
import { Erc20TransferConfirmComponent } from './features/erc20-transfer-confirm/erc20-transfer-confirm.component';
@NgModule({
  declarations: [
    AppComponent,
    LaunchComponent,
    SelectWalletComponent,
    CreateWalletComponent,
    CreateComponent,
    CreateWalletCompleteComponent,
    LoginByPasswordComponent,
    ContractSelectComponent,
    ContentNftListComponent,
    ContentNftDetailComponent,
    CreateBySecretKeyComponent,
    ContentNftSendComponent,
    ContentNftSendResultComponent,
    CreateWalletSaveComponent,
    Erc20BalanceComponent,
    Erc20TransferComponent,
    Erc20TransferConfirmComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    ClipboardModule,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
