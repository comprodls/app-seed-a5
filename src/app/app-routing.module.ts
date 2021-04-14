import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard.component';
import { Login } from './login/login.component';

const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
