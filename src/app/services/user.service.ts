import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { LoginForm } from '../components/login/login.interface';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isUserAuthenticatedRes : any = false;
  constructor(private httpClient: HttpClient) { }

  login(credentials : LoginForm) {
    return this.httpClient.post('/apigateway/login', credentials).pipe(map((res:any)=> {
      this.setIsUserAuthenticatedRes({userAuthenticated : true})
      return res  
    }))
  }
  
  logout() {
    return this.httpClient.post('/apigateway/logout', {}).pipe(map((res:any)=> {
      this.setIsUserAuthenticatedRes({userAuthenticated : false})
      return res  
    }))
  }
  
  getUserDetails() {
    return this.httpClient.get('/apigateway/user')
  }

  isUserAuthenticated() {
    if(this.isUserAuthenticatedRes) {
      return Promise.resolve(this.isUserAuthenticatedRes)
    } else {
      return this.httpClient.get('/apigateway/isUserAuthenticated').pipe(map((res : any)=> {
        this.setIsUserAuthenticatedRes(res)
        return res;
      })).toPromise()
    }
  }
  setIsUserAuthenticatedRes(res : any) {
    this.isUserAuthenticatedRes = res
  }
}
