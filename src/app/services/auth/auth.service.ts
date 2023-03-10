import { Injectable } from '@angular/core';
import { AccountService } from '../account/account.service';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, Subject } from 'rxjs';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  // Whether or not the user is authenticated
  public $isAuthed = new BehaviorSubject<boolean>(false);

  // Construct the auth service with the account validation service
  constructor(private accounts: AccountService, private sessions: SessionService, private router: Router) {

    // Intialize the authentication status
    this.isAuthenticated().subscribe(res => this.$isAuthed.next(res));

    // Check every 5 seconds if the user's authentication status has changed
    setInterval(() => {
      // Get the current authentication status
      this.isAuthenticated().subscribe(currentAuth => {

        // Get the previous authentication status
        let prevAuth = this.$isAuthed.value;

        // Check if the user's authentication status has changed
        if (currentAuth != prevAuth) {

          // Handle when the session expires
          this.onLogout(true);
        }
      });
    }, 5000);
  }

  // Login with credentials
  public onLogin(email: string, password: string, callback: (success: boolean) => void) {
    // Try to validate the account with the credentials
    this.accounts.validate(email, password).subscribe(account => {

      // The account does not exist
      if (account == null) {
        callback(false);
        return;
      }

      // Create a session for a valid account
      this.sessions.create(account).subscribe(success => {
        // Handle errors with session creation
        if (!success) {
          callback(false);
          return;
        }

        // Set the user as authenticated
        this.$isAuthed.next(true);

        // Consume the callback
        callback(success);
      });
    });
  }

  // Attempt to logout of the account
  public onLogout(expired: boolean = false) {

    // Delete the session for the user
    this.sessions.delete().subscribe(success => {

      // Handle errors with session deletion
      if (!success) {
        console.error('Unable to delete the session.');
        return;
      }

      // Redirect to login page with timeout
      this.router.navigate(['/login'], { queryParams: { timeout: expired } });

      // Set the user as not authenticated
      this.$isAuthed.next(false);
    });
  }

  // Check if the user can visit a page that requires authentication
  public canActivate(): Observable<boolean> {

    // Check if the user is authenticated
    return this.isAuthenticated().pipe(
      map(isAuthed => {
        // Redirect to the login page if not logged in
        if (!isAuthed) {
          this.router.navigate(['/login']);
        }

        // Return if the user is authenicated
        return isAuthed;
      })
    )
  }

  // Check if a session by id is authenticated
  public isAuthenticated(): Observable<boolean> {
    // Get the session
    return this.sessions.get().pipe(
      map(session => {

        // No session was found
        if (session == null) {
          return false;
        }

        // Return if the session has expired
        return new Date().getTime() < session.expirationTimestamp;
      })
    );
  }

  // Get the account id of the authenticated user
  public getAccountId(): Observable<string | null> {
    // Get the session
    return this.sessions.get().pipe(
      map(session => {

        // No session was found
        if (session == null) {
          return null;
        }

        // Return the account id
        return session.accountId;
      })
    );
  }
}
