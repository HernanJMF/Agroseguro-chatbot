import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckLoginGuard } from './core/guards/check-login/check-login.guard';
import { ActiveDirectoryGuard } from './core/guards/active-directory-login/active-directory-login.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/security/login/login.module').then( m => m.LoginModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./modules/chat/chat.module').then( (m) => m.ChatPageModule),
    canActivate:[ActiveDirectoryGuard, CheckLoginGuard],
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
