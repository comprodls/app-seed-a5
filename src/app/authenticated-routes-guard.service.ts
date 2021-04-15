import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AuthenticatedRoutesGuard implements CanActivate {

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    canActivate(): boolean | Promise<boolean> {
        return this.userService.isUserAuthenticated().then((res : any) => {
            if(res.userAuthenticated) return true
            else {
                this.router.navigate(['/login']);
                return false
            }
        })
    }
}
