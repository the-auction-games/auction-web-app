import { Injectable } from '@angular/core';
import { AccountService } from '../account/account.service';
import { Account } from 'src/app/models/account.model';
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
          if (!currentAuth) {
            this.onLogout(true);
          }

          // Update the authentication status
          this.$isAuthed.next(currentAuth);
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

        // Successfully created a session in the cache
        console.log(`We created a session: ${success}`);

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

      // Successfully deleted the session
      console.log(`We deleted the session: ${success}`);

      // Redirect to the login page
      this.router.navigate(['/login']);

      // Notify user only when their session expires
      if (expired) {

        // Notify the user 1 sec after forwaring to login
        setTimeout(() => {
          alert('Your session has expired. Please login again');
        }, 1000);

      } else {

        // Update authentication status only if the session did not expire.
        // The auth status will automatically be set to false when it expires.
        this.$isAuthed.next(false);
      }
    });
  }

  // Check if the user can visit a page that requires authentication
  public canActivate(): Observable<boolean> {

    // TODO: GET THE LINK THE USER IS TRYING TO ACCESS SO THAT WE CAN FORWARD THEM AFTER AUTHENTICATION

    // Check if the user is authenticated
    return this.isAuthenticated().pipe(
      map(isAuthed => {
        // Redirect to the login page if not logged in
        if (!isAuthed) {
          this.router.navigate(['/login']); // TODO: SEE ABOVE COMMENT TO FORWARD THE USER TO THE PAGE THEY WERE TRYING TO ACCESS
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

        // Log the session
        // console.log('Checking if session is expired...');
        // console.log(session);

        // Return if the session has expired
        return new Date().getTime() < session.expirationTimestamp;
      })
    );
  }
}
