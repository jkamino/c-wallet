/**
 * @dev 画像ファイルの取得用の実装
 * コントラクトごとに設定が必要な場合はここに実装を行う
 */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageFileService {
  constructor(private http: HttpClient) {}
  //imageFileダウンロード
  async downloadFile(_cid: string, _address: string): Promise<string> {
    //httpで始まる文字列ならそのまま返す
    if (_cid.startsWith('https')) {
      return _cid;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    httpOptions.headers.set('address', _address);
    try {
      //System-specific URL
      const _file = await firstValueFrom(
        this.http.get<any>(`${environment.ipfsUrl}${_cid}`, httpOptions)
      );
      const image = Buffer.from(_file.file.data).toString();
      return image;
    } catch (e) {
      throw e;
    }
  }
}
