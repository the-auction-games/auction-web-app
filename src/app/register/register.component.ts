import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account/account.service';
import { v4 as uuidv4 } from 'uuid';
import { ActivityUtils } from '../services/utils/activity.utils';
import { ActivityService } from '../services/activity/activity.service';
import { ActivityType } from '../services/activity/activity-type.enum';

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
    private router: Router,
    private activityUtils: ActivityUtils,
    private activities: ActivityService
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
    this.accounts.create(account).subscribe(success => {

      // Log the code
      console.log(`Trying to create an account... Success: ${success}`);

      if (success) {
        // Redirect to the login page
        this.router.navigate(['/login']);

        // Create activity
        this.activityUtils.createActivityModel(account.id, ActivityType.CREATE_ACCOUNT).subscribe(activity => {
          // Create the activity
          this.activities.create(activity).subscribe((success) => { });
        });
      } else {
        // Notify of invalid credentials
        this.accountExists = true;
        
        // Log the error
        console.log('Account already exists');
        
        // Reset the password
        this.registerForm.controls['password'].setValue('');
      }
    });

  }
}
