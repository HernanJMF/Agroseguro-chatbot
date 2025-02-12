import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption-service/encryption.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  
  constructor(private encryptionService: EncryptionService) {}

  //simple data handling
  public saveData(key: string, data: boolean | string | number): void {
    localStorage.setItem(
      `${key}`,
      this.encryptionService.encryptData(data) as string
    );
  }

  public removeData(key: string): void {
    localStorage.removeItem(key);
  }

  //obtiene la informacion de un valor particular
  public getData(key: string): boolean | string | number {
    return this.encryptionService.decryptData(
      localStorage.getItem(key) as string
    );
  }

  //Guarda la informacion en formato json
  public saveJSON(key: string, data: JSON | any): void {
    const encryptedData = this.encryptionService.encryptData(
      JSON.stringify(data)
    );
    localStorage.setItem(key, encryptedData);
  }

  //obtiene los items del localstorage
  public getJSON(key: string): JSON | any {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
      return JSON.parse(
        this.encryptionService.decryptData(encryptedData) as string
      );
    }
    return null;
  }

  //borra la informacion del local storage
  public clearLocalStorage(): void {
    localStorage.clear();
  }
}
