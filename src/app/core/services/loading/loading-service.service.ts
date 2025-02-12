import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isShown = false;
  @Output() showEvent: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  //esconde la animacion de carga
  hide() {
    this.isShown = false;
    this.showEvent.emit(this.isShown);
  }

  //muestra la animacion de carga
  show() {
    this.isShown = true;
    this.showEvent.emit(this.isShown);
  }
}