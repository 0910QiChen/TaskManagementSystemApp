import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './Services/user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(): boolean {
    this.checkToken();
    if (this.userService.isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/Login']);
      return false;
    }
  }
  
  private checkToken() {
    const token = this.userService.GetToken();
    if (token) {
      this.userService.isAuthenticated = true;
    } else {
      this.userService.isAuthenticated = false;
    }
  }
}