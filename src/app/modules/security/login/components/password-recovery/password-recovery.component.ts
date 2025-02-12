import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/core/services/users/user.service';
import { confimrForgotPasswordRequest } from 'src/app/shared/models/login/confirm-forgot-password';
import { recoveryRequest } from 'src/app/shared/models/login/password-recovery-request';
import { ToastNotification } from 'src/app/shared/types/ToastNotification';
import { MessageService } from 'src/app/core/services/messages/message.service';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { LoadingService } from 'src/app/core/services/loading/loading-service.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent {
  recovery: any;
  pages: any;
  visible: boolean = false;
  recoveryForm: FormGroup;
  confirmChangePassword: FormGroup;
  showAdditionalFields: boolean = false;
  clickedPasswordInput: boolean = false;
  passwordInputBlurred: boolean = false;
  buttonIsEnabled: boolean = false
  showSuggestions: boolean = false;
  value: string;
  @Input() page: any = "";

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private messageService: MessageService,
              private configService: ConfigService,
              private loadingService : LoadingService) {

    this.page = this.configService.login('es');
    this.resetRecoveryForm();
    this.resetForm();


  }
  resetRecoveryForm() {
    //Formulario de solicitud del código para cambio de contraseña
    this.recoveryForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  resetForm() {
    //Formulario para enviar la nueva contraseña
    this.confirmChangePassword = this.formBuilder.group({
      code: ["", [Validators.required]],
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]]
    },
    {
      validator: this.ConfirmedValidator('newPassword', 'confirmPassword'),//Validación para que la contraseña sea igual en ambos campos
    });

    this.confirmChangePassword.statusChanges.subscribe(status => {
      this.buttonIsEnabled = status === "VALID";
    });
  }

  onSubmit() {
    //Enviar formulario de solicitud de código
    const body = new recoveryRequest('forgot_password', this.recoveryForm.value.email);
    this.userService.recoveryCode(body).subscribe(() => {

    }, (error) => {
      // Maneja el error de la consulta
    });
    this.showAdditionalFields = true;
  }

  sendNewPassword() {
    //Enviar nueva contraseña
    const email = this.recoveryForm.controls['email'].value;
    const body = new confimrForgotPasswordRequest(
      'confirm_forgot_password',
      email,
      this.confirmChangePassword.value.code,
      this.confirmChangePassword.value.newPassword

    );


    this.loadingService.show();
    this.userService.passwordRecovery(body).subscribe(() => {
      const notification: ToastNotification = {
        title: this.page.recovery_password.update_password_title,
        content: this.page.recovery_password.update_password_content,
        success_status: true,
      };
      this.messageService.Notify(notification);
      this.loadingService.hide();
      // Realiza las acciones necesarias con la respuesta del servidor
    }, () => {
      // Maneja el error de la consulta
      this.loadingService.hide();
      const notification: ToastNotification = {
        title: this.page.recovery_password.error_update_password_title,
        content: this.page.recovery_password.error_update_password_content,
        success_status: false,
      };
      this.messageService.Notify(notification);
    });
    this.showAdditionalFields = false;
    this.visible = false;
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    //Validar el match de password y confirmpassword
    return (confirmChangePassword: FormGroup) => {
      const control = confirmChangePassword.controls[controlName];
      const matchingControl = confirmChangePassword.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  isPasswordValid(): boolean {
    const newPasswordControl = this.confirmChangePassword.controls['newPassword'].value;
    return newPasswordControl.valid && this.isLengthValid()
}

  returnEmail(){
    this.showAdditionalFields = false;
    this.visible = false;
    this.visible = true;
  }

  showDialog() {
    this.visible = true;
    this.showAdditionalFields = false;
  }

  isLengthValid(): boolean {
    // Verifica si la longitud es de al menos 8 caracteres
    const passwordControl = this.confirmChangePassword.controls['newPassword'].value;
    const passwordValue = passwordControl;

    return passwordValue.length >= 8;
  }

  isEmailValid(email: string): boolean {
    return email.trim() !== ''; // Verifica si el correo electrónico no está vacío
  }

}
