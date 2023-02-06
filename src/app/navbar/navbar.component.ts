import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // Default the user to not signed in
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    // Add authentication listener
    this.authService.$isAuthed.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnDestory(): void {
    // Remove authentication listener
    this.authService.$isAuthed.unsubscribe();
  }

  // Handle logging out the user
  onLogout() {
    // Log to console that we are logging out the user
    console.log('Logging out the user');
    
    // Log out the user
    this.authService.onLogout()
  }
}
