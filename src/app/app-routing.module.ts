import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard.component';
import { Login } from './login/login.component';
import { AuthenticatedRoutesGuard } from './authenticated-routes-guard.service';
import { UnAuthenticatedRoutesGuard } from './unauthenticated-routes-guard.service';

const routes: Routes = [
  { path: 'dashboard', canActivate: [AuthenticatedRoutesGuard], component: Dashboard },
  { path: 'login', canActivate: [UnAuthenticatedRoutesGuard], component: Login },
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
