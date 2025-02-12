import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesComponent } from './shared/components/messages/messages.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthInterceptor } from './core/http-interceptors/auth/auth.interceptor';

@NgModule({
  declarations: [AppComponent, LoadingComponent, MessagesComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, HttpClientModule, ProgressSpinnerModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Esto permite que múltiples interceptores se registren
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
