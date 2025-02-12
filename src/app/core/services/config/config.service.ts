import { Injectable } from '@angular/core';
import * as JSON_CONFIG from '@json/config.json';

import * as JSON_LOGIN_EN from '@json/modules/security/login/login-en.json';
import * as JSON_LOGIN_ES from '@json/modules/security/login/login-es.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  /*Este servicio sirve para configurar el entorno del proyecto, Permite cambiar el idioma o el tema de la aplicación llamando al
    JSON correspondiente de cada pantalla donde reside la información o configuracion de la vista respectiva*/

  //Security
  public config = JSON_CONFIG;

  constructor(
    ) {
  }

  login(language = "en"){
    switch(language) {
      case "en": {
        return JSON_LOGIN_EN
      }
      case "es": {
        return JSON_LOGIN_ES
      }
      default: {
        return JSON_LOGIN_EN
      }
    }

  }

}
