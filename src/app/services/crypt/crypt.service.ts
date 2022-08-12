/**
 * 暗号化/復号サービス
 */
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptService {
  /**
   * 暗号化
   * @param _text 暗号化する文章
   * @param _password パスフレーズ
   * @returns
   */
  encryption(_text: string, _password: string): string {
    const encrypted = CryptoJS.AES.encrypt(_text, _password);
    return encrypted.toString();
  }
  /**
   * 復号
   * @param _encrypted 暗号化された文章
   * @param _password パスフレーズ
   * @returns
   */
  decryption(_encrypted: string, _password: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(_encrypted, _password);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  }
}
