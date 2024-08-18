import { Component } from '@angular/core';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private userService: UserService) { }
  title = 'TaskManagementSystem';

  logOut() {
    this.userService.LogOut();
  }

  isLoggedIn() {
    return this.userService.isAuthenticated;
  }
}
