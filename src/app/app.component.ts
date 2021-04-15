import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from "rxjs/internal/operators";
import { UserService } from './user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ComproDLS Appseed';
  loggedIn : boolean = false
  showLogoutLoader : boolean = false
  constructor(private router: Router, private userService : UserService) {
    router.events
    .pipe(filter(event => event instanceof RoutesRecognized))
    .subscribe((event : any) => {
      /* Todo : Update this check with data from local storage/api*/
      this.loggedIn = event.url.indexOf("login") == -1 ? true : false
    });
  }

  logout(): void {
    this.showLogoutLoader = true
    this.userService.logout().subscribe(()=> {
      this.showLogoutLoader = false
      this.router.navigate(['/login'])
    })
  }

}
