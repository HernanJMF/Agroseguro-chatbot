import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  //Encripta la informacion con el key generado
  public encryptData(data: any): string {
    return CryptoJS.AES.encrypt(data, environment.encryption_key).toString();
  }

  //Desencripta la informacion con el key generado
  public decryptData(ciphertext: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, environment.encryption_key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
