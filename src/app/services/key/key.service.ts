import { Injectable } from '@angular/core';
import { AddressBook, TransferHistory } from 'src/app/models/models.types';
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

  /**
   * 復号した送信履歴を取得
   */
  async getDecryptedTransferHistoryList(
    _encryptedEmail: string
  ): Promise<TransferHistory[]> {
    const walletAddress = await this.storageService.getWalletAddress() ?? '';
    const encryptedHistory = 
      (await this.storageService.getEncryptedTransferHisory(_encryptedEmail))?.encryptedList ?? '';
    try {
      const decryptedHistoryList:TransferHistory[] =
        JSON.parse(this.cryptService.decryption(encryptedHistory, walletAddress)) || [];
      return decryptedHistoryList;
    } catch(e) {
      return [];
    }
  }

  /**
   * 送信履歴を暗号化して保存
   */
  async setDecryptedTransferHistoryList(
    _encryptedEmail: string,
    _transferHistoryList: TransferHistory[]
  ): Promise<void> {
    const walletAddress = await this.storageService.getWalletAddress() ?? '';
    
    const encryptedHistory = 
      this.cryptService.encryption(JSON.stringify(_transferHistoryList), walletAddress);
    this.storageService.setEncryptedTransferHistory(_encryptedEmail, encryptedHistory);
  }

  /**
   * 復号したアドレスブックを取得
   */
  async getDecryptedAddressBookList(
    _encryptedEmail: string
  ): Promise<AddressBook[]> {
    const walletAddress = await this.storageService.getWalletAddress() ?? '';
    const encryptedAddressBook = 
      (await this.storageService.getEncryptedAddressBook(_encryptedEmail))?.encryptedList ?? '';
    try {
      const decryptedAddressBookList:AddressBook[] =
        JSON.parse(this.cryptService.decryption(encryptedAddressBook, walletAddress)) || [];
      return decryptedAddressBookList;
    } catch(e) {
      return [];
    }
  }

  /**
   * アドレスブックを暗号化して保存
   */
  async setDecryptedAddressBookList(
    _encryptedEmail: string,
    _addressBookList: AddressBook[]
  ): Promise<void> {
    const walletAddress = await this.storageService.getWalletAddress() ?? '';
    
    const encryptedAddressBook = 
      this.cryptService.encryption(JSON.stringify(_addressBookList), walletAddress);
    this.storageService.setEncryptedAddressBook(_encryptedEmail, encryptedAddressBook);
  }
}
