import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/messages/message.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { LoginRequest } from 'src/app/shared/models/login/login-request';
import { ToastNotification } from 'src/app/shared/types/ToastNotification';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { LoadingService } from 'src/app/core/services/loading/loading-service.service';
import { PasswordRecoveryComponent } from '../components/password-recovery/password-recovery.component';
import { Browser } from '@capacitor/browser';  // Importa el plugin de Browser
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: any;
  loginForm: FormGroup;
  value!: string;
  passwordClass: string = "";
  emailClass: boolean = true;
  isValid: boolean; // variable para la validación de usuario
  showPasswordRecovery = false; //Mostrar modal de password recovery
  visible: boolean = false;
  innerWidth: number;
  path: string = "";

  @Input() page: any = "";

  @ViewChild(PasswordRecoveryComponent) uploadChild: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    protected router: Router,
    private messageService: MessageService,
    private configService: ConfigService,
    private location: Location,
    private loadingService: LoadingService
  ) {

    this.page = this.configService.login("es")
    this.page.default
    if (this.userService.isAuthenticated) {
      this.router.navigate(['/chat']);
    }
    this.resetForm();
    this.innerWidth = window.innerWidth;

  }

  resetForm(){ //Formulario de login
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
    this.loginForm.statusChanges.subscribe(status => {
      this.isValid = status == "VALID" ? true : false;
      this.passwordClass = (this.loginForm.controls['password'].touched && this.loginForm.controls['password'].errors?.['required']) ?
                            "ng-invalid ng-dirty" : "";
      this.emailClass = (this.loginForm.controls['username'].touched && this.loginForm.controls['username'].errors?.['required']) ?
                          false : true;
    });
  }

  ngOnInit(): void {
    if (!Capacitor.isNativePlatform()) {
      this.userService.handleWebAuthorization();
    }
  }

  onSubmit() {
    //Enviar la solicitud para loguear
    let loginBody = new LoginRequest(
      this.loginForm.controls['username'].value,
      this.loginForm.controls['password'].value
    );
    this.loadingService.show();
    this.userService.login(loginBody).subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate(['/chat'])
          .then(() => {
            //window.location.reload();
          });
      },
      error: () => {
        this.loadingService.hide();
        // Aquí puedes manejar errores si ocurren
        const notification: ToastNotification = {
          title: 'Credenciales no válidas',
          content: '¡Uy! Parece que tus datos de acceso son incorrectos. Por favor, vuelva a comprobar su usuario y contraseña e inténtelo de nuevo.',
          success_status: false,
        };
        this.messageService.Notify(notification);
      }
    })
  }

  async accessCorporateEmail() {
    const isMobile = Capacitor.isNativePlatform();
    const url = isMobile
      ? 'https://prod-agrobot-chat2dox.auth.eu-west-1.amazoncognito.com/oauth2/authorize?identity_provider=azureadIdp&client_id=bs7g287gho70r6ri1i97udlfi&response_type=code&redirect_uri=chatdocumental://app/chat'
      : 'https://prod-agrobot-chat2dox.auth.eu-west-1.amazoncognito.com/oauth2/authorize?identity_provider=azureadIdp&client_id=bs7g287gho70r6ri1i97udlfi&response_type=code&redirect_uri=https://chatdocumental.demo-newtoms.com/chat';

    // Primero revisa si es web para redirigir inmediatamente en la misma ventana
    if (!isMobile) {
      window.location.href = url;
    } else {
      // Si es la app, abre en un navegador integrado
      await Browser.open({ url });
    }
  }

  showDialog(){
    this.uploadChild.showDialog();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

}
