import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/users/user.service';

@Injectable({
  providedIn: 'root',
})
export class ActiveDirectoryGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    //Obtenemos el codigo que llega desde la URL
    const code = route.queryParams['code'];

    if (code && !this.userService.isAuthenticated) {
      // Intercambiamos el código por los tokens
      await firstValueFrom(this.userService.exchangeCodeForTokens(code));
    }

    if (this.userService.isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
