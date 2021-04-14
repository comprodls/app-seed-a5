import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { LoginForm } from './login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class Login implements OnInit {
  invalidCred = false
  showLoginLoader: boolean = false
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }
  submit(formdata:LoginForm) {
    this.invalidCred = false
    this.showLoginLoader = true;
    this.userService.login(formdata).subscribe((res:any)=> {
      this.showLoginLoader = false;
      if(res.valid) {
        this.router.navigate(['/dashboard'])
      } else {
        this.invalidCred = true
      }
    })
  }
}
