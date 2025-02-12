export class recoveryRequest{
  action: string = "";
  email: string = "";

  constructor(action : string, email: string){
    this.action = action;
    this.email = email;
  }
}
