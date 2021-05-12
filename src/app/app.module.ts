import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Dashboard } from './dashboard/dashboard.component';
import { UserService } from './user.service';
import * as Sentry from "@sentry/angular";
import { Login } from './login/login.component';
import { ImageThumbnailUpdateDirective } from './image-thumbnail-update.directive';
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
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({})
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
