import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Account } from 'src/app/models/account.model';
import { DaprService } from '../dapr.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends DaprService {

  // Base url
  private baseUrl: string = super.getSidecarUrl('account-api', 'api/v1/accounts');

  // Construct the account validation service with an http client.
  constructor(private http: HttpClient) {
    super();
  }

  // Get an account based off the id.
  public getById(id: string): Observable<Account | null> {
    // The url to the user api
    let url = `${this.baseUrl}/id/${id}`;

    // Make the request
    return this.http.get<Account>(url, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.body as Account),
        catchError(error => of(null))
      );
  }

  // Get an account based off the email.
  public getByEmail(email: string): Observable<Account | null> {
    // The url to the user api
    let url = `${this.baseUrl}/id/${email}`;

    // Make the request
    return this.http.get<Account>(url, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.body as Account),
        catchError(error => of(null))
      );
  }

  // Create an account
  public create(account: Account): Observable<boolean> {
    // The url to the user api
    let url = `${this.baseUrl}`;

    // Make the request
    return this.http.post(url, account, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status === 201),
        catchError(error => of(false))
      );
  }

  // Update an account
  public update(account: Account): Observable<boolean> {
    // The url to the user api
    let url = `${this.baseUrl}`;

    // Make the request
    return this.http.put(url, account, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status === 204),
        catchError(error => of(false))
      );
  }

  // Delete an account by id
  public delete(id: string): Observable<boolean> {
    // The url to the user api
    let url = `${this.baseUrl}/id/${id}`;

    // Make the request
    return this.http.delete(url, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status === 204),
        catchError(error => of(false))
      );
  }

  // Valdate an account based on the email and password.
  public validate(email: string, password: string): Observable<Account | null> {
    // The url to the user api
    let url = `${this.baseUrl}/validate`;

    // The body of the request
    let body = {
      email: email,
      password: password
    };

    // Make the request
    return this.http.post<Account>(url, body, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.body as Account),
        catchError(error => of(null))
      );
  }
}
