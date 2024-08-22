import { Component } from '@angular/core';
import { LoginUser, RegisterUser, UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})

export class UserComponent {

  RegisterForm: FormGroup;
  LoginForm: FormGroup;
  isLogin: boolean = true;

  constructor(private userService: UserService, private router: Router, private builder: FormBuilder, private snackBar: MatSnackBar) {
    this.RegisterForm = this.builder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });

    this.LoginForm = this.builder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
    })
  }

  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
  
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ ['mismatch']: true });
      return { ['mismatch']: true };
    } else if (confirmPassword.length == 0) {
      form.get('confirmPassword')?.setErrors({ ['required']: true });
      return { ['required']: true };
    }
    else {
      form.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  Register() {
    if(this.RegisterForm.valid) {
      const RegisterInfo: RegisterUser = {
        Username: this.RegisterForm.get('username')?.value,
        UserPassword: this.RegisterForm.get('password')?.value,
        ConfirmPassword: this.RegisterForm.get('confirmPassword')?.value,
      }
      this.userService.Register(RegisterInfo).subscribe({
        next: response => {
          this.openSnackBar('Registration Successful!');
        },
        error: err => {
          this.openSnackBar(`Registration Failed! ${ err }`);
        }
      });
    } else {
      this.openSnackBar('Register Failed!');
    }
  }

  Login() {
    if (this.LoginForm.valid) {
      const LoginInfo: LoginUser = {
        username: this.LoginForm.get('username')?.value,
        password: this.LoginForm.get('password')?.value,
        grant_type: 'password',
      };
      this.userService.Login(LoginInfo).subscribe({
        next: response => {
          console.log('Login successful', response);
          this.openSnackBar('Login Successful!');
          this.router.navigateByUrl('Tasks');
        },
        error: err => {
          this.openSnackBar('Login Failed!');
          console.log('Login error', err);
        }
      });
    } else {
      this.openSnackBar('Login Failed!');
    }
  }

  openSnackBar(message: string): void {
    const config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: { message, dismiss: () => this.snackBar.dismiss() }
    };

    this.snackBar.openFromComponent(SnackBarComponent, config);
  }
}