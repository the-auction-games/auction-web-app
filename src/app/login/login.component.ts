import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Whether or not the form has been submitted
  isSubmitted = false;

  // The login form
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  // Whether or not the credentials are invalid
  invalidCredentials = false;

  // Whether or not the user was timed out
  protected timeout = false;

  // Construct the login component with the auth service  
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  // Initialize the component
  ngOnInit(): void {
    // Check if the user is already logged in
    if (this.auth.$isAuthed.value) {
      // Forward the user to the market page
      this.router.navigate(['/market'], { queryParams: { useLastResult: true } });
    }

    // Check if the user was timed out
    if (this.route.snapshot.queryParams['timeout'] == 'true') {
      // Set timeout flag
      this.timeout = true;
    }
  }

  // Method to handle login event
  onSubmit() {
    // Display validation errors
    if (this.loginForm.invalid) {
      this.isSubmitted = true;
      return;
    }

    // Attempt to login
    this.auth.onLogin(this.loginForm.value.email || '', this.loginForm.value.password || '', success => {
      // Check if the login was successful
      if (success) {
        // Forward the user to the market page
      this.router.navigate(['/market'], { queryParams: { useLastResult: true } });
      } else {
        // Set the invalid credentials flag
        this.invalidCredentials = true;

        // Reset the password
        this.loginForm.controls['password'].setValue('');
      }
    });
  }
}
