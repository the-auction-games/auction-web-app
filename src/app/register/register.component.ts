import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account/account.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // Whether or not the form has been submitted
  isSubmitted = false;

  // The register form
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
  });

  // Whether or not an account already exists with that email
  accountExists = false;

  // Construct the login component with the auth service  
  constructor(
    private accounts: AccountService,
    private router: Router
  ) { }

  // Handle registration with the credentials
  onSubmit() {
    // Display validation errors
    if (this.registerForm.invalid) {
      this.isSubmitted = true;
      return;
    }

    // Create the account
    let account: Account = {
      id: uuidv4(),
      name: this.registerForm.value.name || '',
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.password || ''
    }

    // Attempt to create the account, handle response codes
    this.accounts.create(account).subscribe(status => {

      // Log the code
      console.log(`Trying to create an account... response code: ${status}`);

      switch (status) {
        case 201:
          // Redirect to the login page
          this.router.navigate(['/login']);
          break;
        case 409:
          // Notify of invalid credentials
          this.accountExists = true;

          // Log the error
          console.log('Account already exists');

          // Reset the password
          this.registerForm.controls['password'].setValue('');
          break;
        default:
          break;
      };
    });

  }
}
