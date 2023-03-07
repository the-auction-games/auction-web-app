import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Account } from 'src/app/models/account.model';
import { Session } from 'src/app/models/session.model';
import { v4 as uuidv4 } from 'uuid';
import { DaprService } from '../dapr.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends DaprService {

  // Base url
  private baseUrl: string = super.getSidecarUrl('session-api', 'api/v1/sessions');

  // Local storage key
  private localStorageKey: string = 'session';

  // Construct the session service with the http client
  constructor(private http: HttpClient) {
    super();
  }

  // Get an existing session
  public get(): Observable<Session | null> {
    // Check if the session id is in local storage
    if (!this.hasSessionId()) {
      return of(null);
    }

    // Create the url
    let url = `${this.baseUrl}/${this.getSessionId()}`;

    // Get the session from the cache
    return this.http.get<Session>(url, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.body as Session),
        catchError(error => of(null))
      );
  }

  // Create a session for the user
  public create(account: Account): Observable<boolean> {
    // Create the session
    let session: Session = {
      id: uuidv4(),
      accountId: account.id,
      creationTimestamp: new Date().getTime(),
      expirationTimestamp: new Date().getTime() + 60_000 * 30 // 30 minutes before expiration
    };

    // Add session to local storage
    localStorage.setItem(this.localStorageKey, session.id);

    // Send session to dapr cache
    return this.http.post(this.baseUrl, session, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status == 201)
      );
  }

  // Delete an existing session
  public delete(): Observable<boolean> {
    // Check if the session id is in local storage
    if (!this.hasSessionId()) {
      console.error('A session id does not exist in local storage.')
      return of(false);
    }

    // Get the session id from local storage
    let sessionId = this.getSessionId();

    // Delete local storage after obtaining the session id
    this.deleteSessionId();

    // Create the url
    let url = `${this.baseUrl}/${sessionId}`;

    // Delete the session from the cache
    return this.http.delete(url, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status == 204)
      );
  }

  // Check if the sesion id is in local storage
  private hasSessionId(): boolean {
    return localStorage.getItem(this.localStorageKey) != null;
  }

  // Get the session id from local storage
  private getSessionId(): string {
    return localStorage.getItem(this.localStorageKey) || "";
  }

  // Delete the session id from local storage
  private deleteSessionId(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}

