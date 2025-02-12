import { Component, ElementRef, OnInit } from '@angular/core';
import { UserService } from './core/services/users/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isLogged: boolean = false;

  constructor( private userService: UserService,
  ) {
    this.isLogged = this.userService.isAuthenticated;

  }

  ngOnInit(): void {
    this.userService.userDataObservable.subscribe(() => {
      this.isLogged = this.userService.isAuthenticated;
    });
  }
}
