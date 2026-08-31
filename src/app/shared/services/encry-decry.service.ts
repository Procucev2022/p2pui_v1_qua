import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryDecryService {

  constructor() { }

  private getKey(keys?: string): string {
    return keys || environment.storageEncryptionKey;
  }

  // The set method is use for encrypt the value.
  set(value: any): string;
  set(keys: string, value: any): string;
  set(keysOrValue: string | any, value?: any): string {
    const hasExplicitKey = arguments.length > 1;
    const keyStr = this.getKey(hasExplicitKey ? keysOrValue : undefined);
    const plainValue = hasExplicitKey ? value : keysOrValue;
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const iv = CryptoJS.enc.Utf8.parse(keyStr);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainValue.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  // The get method is use for decrypt the value.
  get(value: string): string;
  get(keys: string, value: string): string;
  get(keysOrValue: string, value?: string): string {
    const hasExplicitKey = arguments.length > 1;
    const keyStr = this.getKey(hasExplicitKey ? keysOrValue : undefined);
    const encryptedValue = hasExplicitKey ? value : keysOrValue;
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const iv = CryptoJS.enc.Utf8.parse(keyStr);
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
