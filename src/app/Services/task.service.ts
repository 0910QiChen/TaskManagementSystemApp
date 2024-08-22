import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  private apiUrl = 'https://tms0822-gsfnfbf4g3e8acd4.eastus-01.azurewebsites.net/';

  constructor(private http: HttpClient, private userService: UserService) { }

  GetQuotes(): Observable<any> {
    const token = this.userService.GetToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Task[]>(`${this.apiUrl}/quotes`, { headers }).pipe(
      catchError(error => {
        let errorMessage = 'An unknown error occurred';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        return throwError(errorMessage);
      })
    );
  }

  GetQuote(id: number): Observable<any> {
    const token = this.userService.GetToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Task>(`${this.apiUrl}/quotes/${id}`, { headers }).pipe(
      catchError(error => {
        let errorMessage = 'An unknown error occurred';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        return throwError(errorMessage);
      })
    );
  }

  AddQuote(quote: Task): Observable<any> {
    const token = this.userService.GetToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Task>(`${this.apiUrl}/quotes`, quote, { headers }).pipe(
      catchError(error => {
        let errorMessage = 'An unknown error occurred';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        return throwError(errorMessage);
      })
    );
  }

  EditQuote(id: number, quote: Task): Observable<any> {
    const token = this.userService.GetToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Task>(`${this.apiUrl}/quotes/${id}`, quote, { headers }).pipe(
      catchError(error => {
        let errorMessage = 'An unknown error occurred';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        return throwError(errorMessage);
      })
    );
  }

  RemoveQuote(id: number): Observable<any> {
    const token = this.userService.GetToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<Task>(`${this.apiUrl}/quotes/${id}`, { headers }).pipe(
      catchError(error => {
        let errorMessage = 'An unknown error occurred';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        return throwError(errorMessage);
      })
    );
  }
}

export interface Task {
  QuoteID: number;
  QuoteType: string;
  Description: string;
  Sales: string;
  DueDate: Date;
  Premium: number;
}