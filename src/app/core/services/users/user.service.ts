import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  firstValueFrom,
  map,
  throwError,
}from 'rxjs';
import { HttpService } from '../../http/http.service';
import { LoginRequest } from 'src/app/shared/models/login/login-request';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { ConfigService } from '../config/config.service';

import { Router } from '@angular/router';
import { recoveryRequest } from 'src/app/shared/models/login/password-recovery-request';
import { confimrForgotPasswordRequest } from 'src/app/shared/models/login/confirm-forgot-password';
import { HttpClient, HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userSettings: any = null;
  private userDataSubject = new BehaviorSubject<any>({});
  userDataObservable = this.userDataSubject.asObservable();
  isMobile: boolean = Capacitor.isNativePlatform();


  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private http: HttpClient,

  ) {
    this.listenToDeepLink();

  }
//Obtener uno a uno los datos del usuario para el local storage ----
  private get userSettings(): any {
    return this._userSettings;
  }

  setUserSettings(userSettings: any): void {
    this.localStorageService.saveJSON('user_settings', userSettings);
    this._userSettings = userSettings;
    this.userDataSubject.next({});
  }

    // Método para obtener la configuración del usuario
    getUserSettings(): any {
      return this.localStorageService.getJSON('user_settings');
    }

  private set userSettings(value: any) {
    this.localStorageService.saveJSON('user_settings', value);
    this._userSettings = this.localStorageService.getJSON('user_settings');
  }

  public get email(): string {
    return this.localStorageService.getJSON('user_settings').email;
  }

  public get firstName(): string {
    return this.localStorageService.getJSON('user_settings').firstName;
  }

  public get user_data(): any {
    return this.localStorageService.getJSON('user_settings');
  }


  public get idToken(): string {
    return this.localStorageService.getJSON('user_settings').idToken;
  }

  public get refreshToken(): string {
    return this.localStorageService.getJSON('user_settings').refreshToken;
  }

  public get isAuthenticated(): boolean {
    let isLogged = this.localStorageService.getJSON('user_settings') ? this.localStorageService.getJSON('user_settings') : false;
    return isLogged.isLogged ? true : false;
  }

  login(body: LoginRequest):Observable<any>{
    //solicitud para el ingreso del usuario en la aplicación
    const headers = {
      'Content-Type': 'application/json',


    };
    return this.httpService
      .post(
        `/login`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {
          let user_settings = {
            isLogged: true,
            firstName: res.user_data.first_name || '',
            email: res.user_data.email || '',
            lastName: res.user_data.last_name || '',
            role: res.user_data.role || '',
            userStatus: res.user_data.user_status || '',
            statusPlan: res.user_data.status_plan || '',
            plan:
              res.user_data.plan == undefined
                ? res.user_data.user_plan
                : res.user_data.plan,
            language: res.user_data.language.toLowerCase(),
            tokensLimit: res.user_data.tokens_limit,
            topic: res.user_data.topic || '',
            admin: res.user_data.admin || '',
            idToken: res.id_token,
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            expiresIn: res.expires_in,
            expandLogo: res.user_data.expand_logo || '',
            sidebarLogo: res.user_data.sidebar_logo || '',
            renew_date: res.user_data.period_end_date || '',
            price: res.user_data.plan_amount || '',
            theme: 'light',
            credits: res.user_data.credits || '',
            username: res.user_data.email,
            externalProvider: false
          }
          this.userSettings = user_settings
          return res;
        }),
        catchError((err): any => {
          //this.errorService.HandleError(err);
        })
      );

  }

  logout(){
    //Solicitud que borra el localstorage del usuario para cerrar sesion
    this.localStorageService.clearLocalStorage();
    this.router.navigate(['/login'])
      .then(() => {
        window.location.reload();
      });;
  }

  recoveryCode(body: recoveryRequest){
    //Solicitud para el código de cambio de contraseña
    const headers = {
      'Content-Type': 'application/json',
      'no-auth': 'true',
      'no-token-refresh': 'true',

    };
    return this.httpService
      .post(
        `/forgot-password`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {

          return res;
        })
      );
  }

  passwordRecovery(body: confimrForgotPasswordRequest){
    //Solicitud para el cambio de contraseña
    const headers = {
      'Content-Type': 'application/json',
      'no-auth': 'true',
      'no-token-refresh': 'true',

    };
    return this.httpService
      .post(
        `/forgot-password`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {

          return res;
        })
      );
  }

  public handleWebAuthorization() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.exchangeCodeForTokens(code).subscribe({
        next: () => {
          console.log('Tokens received and stored');
          this.clearUrl();
        },
        error: (err) => console.error('Error exchanging code:', err),
      });
    }
  }

  tokenRefresh(): Observable<any> {
    //Solicitud para refrescar tokens de tal forma que se puedan seguir haciendo solicitudes al back cuando se renueva
    const headers = {
      'Content-Type': 'application/json'
    };

    return this.httpService.post(
      `/refresh-token`,
      { refresh_token: this.refreshToken },
      headers
    ).pipe(
      map((res: any) => {
        this.updateTokens(res.access_token, res.id_token);
        return res;
      }),
      catchError((err): any => {
        //this.errorService.HandleError(err);
      })
    );
  }

  updateTokens(accessToken: string, idToken: string){
    let updatedUserData = this.localStorageService.getJSON('user_settings');
    updatedUserData.accessToken = accessToken;
    updatedUserData.idToken = idToken;
    this.localStorageService.saveJSON('user_settings', updatedUserData);
  }

  clearUrl() {
    if (window.history.replaceState) {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  private listenToDeepLink() {
    if (Capacitor.isNativePlatform()) {
      App.addListener('appUrlOpen', (data: any) => {
        if (data && data.url) {
          const url = new URL(data.url);
          const code = url.searchParams.get('code');
          if (code) {
            this.exchangeCodeForTokens(code).subscribe({
              next: () => {
                console.log('Tokens received and stored');
              },
              error: (err) => console.error('Error exchanging code:', err),
            });
          }
        }
      });
    }
  }

  //Cambiamos el codigo recibido por la informacion del token_id del usuario
  exchangeCodeForTokens(code: string): Observable<any> {
    const isMobile = Capacitor.isNativePlatform();
    const redirectUri = isMobile
      ? 'chatdocumental://app/chat'
      : 'https://chatdocumental.demo-newtoms.com/chat';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'no-auth': 'true',
    };

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: 'bs7g287gho70r6ri1i97udlfi',
      code: code,
      redirect_uri: redirectUri,
    });

    return this.http.post('https://prod-agrobot-chat2dox.auth.eu-west-1.amazoncognito.com/oauth2/token', params.toString(), { headers }).pipe(
      map((res: any) => {
        console.log("Token response:", res);
        this.parseAndStoreTokens(res);
        return res;
      }),
      catchError((error) => {
        console.error("Error response:", error.error);
        return throwError(() => new Error("Error al intercambiar código por tokens"));
      })
    );
  }

  decodeToken(idToken: string | null) {
    try {
      if (idToken) {
        console.log("decorde token",idToken);
        return jwtDecode(idToken);
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
    return {};
  }

  parseAndStoreTokens(tokens: any) {
    if (!tokens || !tokens.id_token) {
      console.error('Invalid token response:', tokens);
      return;
    }

    const idToken = tokens.id_token;
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    const expiresIn = tokens.expires_in;
    // Decodificar y guardar tokens
    const userData: any = this.decodeToken(idToken);
    console.log("user settings", userData);
    const user_settings = {
      isLogged: true,
      firstName: userData.given_name || '',
      email: userData.email || '',
      lastName: userData.family_name || '',
      role: userData.role || '',
      userStatus: userData.user_status || '',
      statusPlan: userData.status_plan || '',
      plan: userData.plan || '',
      language: (userData.language || '').toLowerCase(),
      tokensLimit: userData.tokens_limit || '',
      topic: userData.topic || [],
      admin: userData.admin || '',
      idToken,
      accessToken,
      refreshToken,
      expiresIn,
      expandLogo: userData.expand_logo || '',
      sidebarLogo: userData.sidebar_logo || '',
      renew_date: userData.period_end_date || '',
      price: userData.plan_amount || '',
      theme: 'light',
      credits: userData.credits || '',
      externalProvider: userData.external_provider || ''
    };

    this.setUserSettings(user_settings);

    this.userDataSubject.next({});
    this.router.navigate(['/chat']);
  }

}
