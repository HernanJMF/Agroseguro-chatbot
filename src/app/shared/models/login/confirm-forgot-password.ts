export class confimrForgotPasswordRequest{
  action: string = "";
  email: string = "";
  confirmation_code: string = "";
  new_password: string = "";

  constructor(action : string, email: string,
    confirmation_code: string, new_password: string){
    this.action = action;
    this.email = email;
    this.confirmation_code = confirmation_code;
    this.new_password = new_password
  }
}
