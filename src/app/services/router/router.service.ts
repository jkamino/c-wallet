/**
 * ルート検知用のサービス
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private previousUrl!: string;
  private currentUrl!: string;
  public setPreviousUrl(_previousUrl: string): void {
    this.previousUrl = _previousUrl;
  }
  public setCurrentUrl(_currentUrl: string): void {
    this.currentUrl = _currentUrl;
  }
  public getPreviousUrl(): string {
    return this.previousUrl;
  }
  public getCurrentUrl(): string {
    return this.currentUrl;
  }
}
