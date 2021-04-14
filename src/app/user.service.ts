import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { LoginForm } from './login/login.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  login(credentials : LoginForm) {
    return this.httpClient.post('/apigateway/login', credentials)
  }
  
  logout() {
    return this.httpClient.post('/apigateway/logout', {})
  }
  
  getUserDetails() {
    return this.httpClient.get('/apigateway/user')
  }
}
