import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = 'http://192.168.1.52:81/api';

  isAuthenticated = false;

  constructor(private http: HttpClient) { }

  Register(registerInfo: RegisterUser): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Register`, registerInfo).pipe(
      catchError(error =>{
        let errorMessage = 'An unknown error occurred!!!';
        if(error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        return throwError(errorMessage);
      })
    )
  }

  Login(loginInfo: LoginUser): Observable<any> {
    const body = new URLSearchParams({
      grant_type: 'password',
      username: loginInfo.username,
      password: loginInfo.password
    }).toString();

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(`${this.apiUrl}/Login`, body, { headers }).pipe(
      tap(response => {
        this.StoreToken(response.access_token);
        this.isAuthenticated = true;
      }),
      catchError(error =>{
        let errorMessage = 'An unknown error occurred';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        return throwError(errorMessage);
      })
    )
  }

  LogOut() {
    this.RemoveToken();
    this.isAuthenticated = false;
  }

  StoreToken(access_token: string) {
    localStorage.setItem('token', access_token);
  }

  GetToken() {
    return localStorage.getItem('token');
  }

  RemoveToken() {
    localStorage.removeItem('token');
  }
}

export interface RegisterUser {
  Username: string;
  UserPassword: string;
  ConfirmPassword: string;
}

export interface LoginUser {
  username: string;
  password: string;
  grant_type: string;
}
