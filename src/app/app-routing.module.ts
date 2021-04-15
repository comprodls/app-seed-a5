import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard.component';
import { Login } from './components/login/login.component';
import { AuthenticatedRoutesGuard } from './services/authenticated-routes-guard.service';
import { UnAuthenticatedRoutesGuard } from './services/unauthenticated-routes-guard.service';

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
