import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { UserService } from './services/user.service';
import * as Sentry from "@sentry/angular";
import { Login } from './components/login/login.component';
import { ImageThumbnailUpdateDirective } from './directives/image-thumbnail-update.directive';
import { AuthenticatedRoutesGuard } from './services/authenticated-routes-guard.service';
import { UnAuthenticatedRoutesGuard } from './services/unauthenticated-routes-guard.service';
declare const SENTRY_DSN: string;

Sentry.init({
  dsn: SENTRY_DSN
});
@NgModule({
  declarations: [
    AppComponent,
    Dashboard,
    Login,
    ImageThumbnailUpdateDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrf-token',
      headerName: 'csrf-token'
    }),
    FormsModule
  ],
  providers: [
    UserService,
    AuthenticatedRoutesGuard,
    UnAuthenticatedRoutesGuard,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({})
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
