import { Injectable } from '@angular/core';
import { CryptService } from '../crypt/crypt.service';
import { StorageService } from '../storage/storage.service';
import { Web3Service } from '../web3/web3.service';

@Injectable({
  providedIn: 'root',
})
export class KeyService {
  memoryKey = '';
  emailAddress = '';
  constructor(
    private web3Service: Web3Service,
    private storageService: StorageService,
    private cryptService: CryptService
  ) {}

  /**
   * メモリキー保存
   */
  setMemoryKey(_key: string) {
    this.memoryKey = _key;
  }
  /**
   * メモリキー取得
   */
  getMemoryKey(): string {
    return this.memoryKey;
  }
  /**
   * メモリーにアドレス保存
   */
  setMemoryEmailAddress(_email: string) {
    this.emailAddress = _email;
  }
  /**
   * メモリーのメールアドレスを取得
   * @returns {string} email
   */
  getMemoryEmailAddress(): string {
    return this.emailAddress;
  }
  /**
   * 秘密鍵からアドレスを取得
   * @param _privateKey
   * @returns {string} アドレス
   */
  async getAddressByPrivateKe(_privateKey: string): Promise<string> {
    try {
      const responseAddress: string =
        await this.web3Service.privateKeyToAddress(_privateKey);
      return responseAddress;
    } catch (error) {
      return '';
    }
  }
  /**
   * 秘密鍵とアドレスのチェック
   * @param _ethAddress
   * @param _privateKey
   * @returns boolean
   */
  async checkPrivateKeyToAddress(
    _ethAddress: string,
    _privateKey: string
  ): Promise<boolean> {
    try {
      const responseAddress: string =
        await this.web3Service.privateKeyToAddress(_privateKey);
      return responseAddress === _ethAddress ? true : false;
    } catch (error) {
      return false;
    }
  }
  /**
   * パスワード確認
   * @param _password パスワード
   * @param _confirm 確認パスワード
   * @returns {string | null} 合致ならパスワードを返す
   */
  checkConfirmPassword(_password: string, _confirm: string): string | null {
    if (_password === _confirm) {
      return _password;
    } else {
      return null;
    }
  }
  /**
   * 復号メールアドレスを取得
   * @returns
   */
  async getDecryptEmailAddress(
    _walletAddress: string | null = null,
    _emailAddress: string | null = null
  ): Promise<string> {
    const encryptEmailAddress =
      (await this.storageService.getEmailAddress()) ?? _emailAddress ?? '';
    const walletAddress =
      _walletAddress ?? (await this.storageService.getWalletAddress()) ?? '';
    try {
      const decryptedEmail = this.cryptService.decryption(
        encryptEmailAddress,
        walletAddress
      );
      return decryptedEmail;
    } catch {
      return '';
    }
  }
}
