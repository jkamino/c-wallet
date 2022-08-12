/**
 * authorization
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/models.types';
import { CryptService } from '../crypt/crypt.service';
import { KeyService } from '../key/key.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private storageService: StorageService,
    private cryptService: CryptService,
    private keyService: KeyService,
    private router: Router
  ) {}
  /**
   * 認証チェック　OSS版はStorageのwalletAddressの有無で判定
   * @returns {boolean} 認証状態をチェック
   */
  async isAuth(): Promise<boolean> {
    const walletAddress = await this.storageService.getWalletAddress();
    if (walletAddress) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * ログイン
   */
  async logIn(_email: string, _password: string): Promise<boolean> {
    const accounts = await this.storageService.getAccounts();
    if (accounts.length === 0) {
      throw 'account not found';
    }
    for await (const account of accounts) {
      const decryptedPrivateKey = this.cryptService.decryption(
        account.privateKey,
        _password
      );
      const walletAddress = await this.keyService.getAddressByPrivateKe(
        decryptedPrivateKey
      );
      if (!walletAddress) {
        continue;
      }
      const decryptedEmail = await this.keyService.getDecryptEmailAddress(
        walletAddress,
        account.emailAddress
      );
      if (_email === decryptedEmail) {
        await this.storageService.setPrivateKey(account.privateKey);
        await this.storageService.setWalletAddress(walletAddress);
        await this.storageService.setEmailAddress(account.emailAddress);
        await this.storageService.setContractService(account.contractService);
        await this.storageService.setContractList(account.contractList);
        return true;
      } else {
        continue;
      }
    }
    return false;
  }
  /**
   * emailチェック
   */
  async checkSameEmail(_email: string, _password: string): Promise<boolean> {
    const accounts = await this.storageService.getAccounts();
    if (accounts.length === 0) {
      return false;
    }
    for await (const account of accounts) {
      const decryptedPrivateKey = this.cryptService.decryption(
        account.privateKey,
        _password
      );
      const walletAddress = await this.keyService.getAddressByPrivateKe(
        decryptedPrivateKey
      );
      if (!walletAddress) {
        continue;
      }
      const decryptedEmail = this.cryptService.decryption(
        account.emailAddress,
        walletAddress
      );
      if (decryptedEmail === _email) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }
  /**
   * ログアウト
   */
  async logOut(): Promise<void> {
    const privateKey = (await this.storageService.getPrivateKey()) ?? '';
    const emailAddress = (await this.storageService.getEmailAddress()) ?? '';
    const contractService =
      (await this.storageService.getContractService()) ?? '';
    const contractList = await this.storageService.getContractList();
    const accounts: Account[] = await this.storageService.getAccounts();
    if (accounts.length === 0) {
      const _account: Account = {
        privateKey,
        emailAddress,
        contractService,
        contractList,
      };
      await this.storageService.setAccounts([_account]);
    } else {
      const index = accounts.findIndex((account) => {
        return account.emailAddress === emailAddress;
      });
      if (index === -1) {
        const _account: Account = {
          privateKey,
          emailAddress,
          contractService,
          contractList,
        };
        accounts.push(_account);
        await this.storageService.setAccounts(accounts);
      } else {
        const _account: Account = {
          privateKey,
          emailAddress,
          contractService,
          contractList,
        };
        accounts[index] = _account;
        await this.storageService.setAccounts(accounts);
      }
    }
    await this.storageService.clearPrivateKey();
    await this.storageService.clearWalletAddress();
    await this.storageService.clearTransactionHash();
    await this.storageService.clearContractList();
    await this.storageService.clearContractName();
    await this.storageService.clearContractService();
    await this.storageService.clearContractAddress();
    await this.storageService.clearEmailAddress();
    this.router.navigate(['/select-wallet']);
  }
}
