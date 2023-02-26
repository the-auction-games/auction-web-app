import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observer, switchMap } from 'rxjs';
import Auction from '../models/auction.model';
import { AuctionService } from '../services/auction/auction.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../services/auth/auth.service';
import { ActivityType } from '../services/activity/activity-type.enum';
import { ActivityService } from '../services/activity/activity.service';
import { ActivityUtils } from '../services/utils/activity.utils';

@Component({
  selector: 'app-edit-auction',
  templateUrl: './edit-auction.component.html',
  styleUrls: ['./edit-auction.component.css']
})
export class EditAuctionComponent {

  // A default auction, will be loaded on init if an auction id is provided
  protected auction: Auction = {
    id: uuidv4(),
    sellerId: '',
    title: '',
    description: '',
    startBid: 0,
    bids: [],
    binPrice: 0,
    purchase: null,
    base64Image: '',
    creationTimestamp: new Date().getTime(),
    expirationTimestamp: new Date().setDate(new Date().getDate() + 7),
  };

  // Is this a new auction, or is the user editing an existing auction
  protected isNew: boolean = false;

  // Whether or not the form has been submitted
  protected isSubmitted: boolean = false;

  // The image preview url
  protected url: any = null;

  // The auction form
  protected auctionForm = new FormGroup({
    image: new FormControl('', []),
    title: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    description: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(300)]),
    startBid: new FormControl('', [Validators.required, Validators.min(1), Validators.max(1000000)]),
    binPrice: new FormControl('', [Validators.required, Validators.min(1), Validators.max(2000000)]),
  });

  // Construct the edit auction component
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auctions: AuctionService,
    private auth: AuthService,
    private activities: ActivityService,
    private activityUtils: ActivityUtils
  ) { }

  ngOnInit(): void {
    // Log loading of auction
    console.log('Loading auction...');

    // Get the auction id from the query parameter
    this.route.paramMap.subscribe(params => {

      // The auction id
      let id = params.get('auctionId');

      // Check if exists
      if (id) {

        // Get the auction from the auction service
        this.auctions.get(id).subscribe(res => {

          // Check if the auction exists
          if (res === null) {
            console.log('Auction not found');
            this.router.navigate(['market']);
            return;
          } else {
            // Set the auction
            this.auction = res;

            // Set the form values
            this.auctionForm.controls.title.setValue(this.auction.title);
            this.auctionForm.controls.description.setValue(this.auction.description);
            this.auctionForm.controls.startBid.setValue(this.auction.startBid.toString());
            this.auctionForm.controls.binPrice.setValue(this.auction.binPrice.toString());

            // Set the image preview
            this.url = 'data:image/png;base64,' + this.auction.base64Image;
          }

        });
      } else {

        // This is a new auction
        this.isNew = true;

        // Get the account id
        this.auth.getAccountId().subscribe(res => {
          if (res !== null) {
            // Set seller id for new auction
            this.auction.sellerId = res;

          } else {

            // Redirect to login, user does not have an id
            this.router.navigate(['login']);
          }
        });
      }
    });
  }

  // Preview the image very time a new file is selected
  onFileChanged(event: any) {

    // No file selected
    const files = event.target.files;
    if (files.length === 0) {
      console.log('No file selected');
      return;
    }

    // The file
    let file = files[0];

    // Check file type
    if (file.type.match(/image\/*/) == null) {
      console.log("Only images are supported.")
      return;
    }

    // Create file reader
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.url = reader.result;
      console.log(reader.result);
    };
  }

  // Cancel the Edit
  protected onCancel(): void {
    // Go back one page
    window.history.back();
  }
  // Delete the auction
  protected onDelete(): void {

    // Check if the auction exists
    if (!this.isNew) {

      // Delete the auction
      this.auctions.delete(this.auction.id).subscribe(success => {

        // Check if successful
        if (success) {
          // Redirect back to the market 
          this.router.navigate(['market']);
        } else {
          // Notify user of failure
          alert('Failed to delete auction. Please try again.');
        }
      });
    }
  }

  // Handle the auction form submission
  protected onSubmit(): void {
    // Set form to submitted
    this.isSubmitted = true;

    // Initialize form to valid
    let invalid: boolean = false;

    // Display validation errors
    if (this.auctionForm.invalid) {
      // Set form to invalid
      invalid = true;
    }

    // Ensure new auctions provide an image (existing auctions will default to the current image)
    if (this.auctionForm.controls.image.value === '' && this.isNew) {
      // Set image to invalid
      this.auctionForm.controls.image.setErrors({ 'required': true });

      // Set form to invalid
      invalid = true;
    }

    // Return if invalid
    if (invalid) {
      return;
    }

    // Set the auction properties
    this.auction.title = this.auctionForm.controls.title.value || '';
    this.auction.description = this.auctionForm.controls.description.value || '';
    this.auction.startBid = Number(this.auctionForm.controls.startBid.value || 0);
    this.auction.binPrice = Number(this.auctionForm.controls.binPrice.value || 0);

    // Get base64 image and set it to the auction
    this.auction.base64Image = this.getBase64();

    // Create or update the auction
    if (this.isNew) {
      // Create a new auction
      this.auctions.create(this.auction).subscribe(success => {

        // Check if successful
        if (success) {
          // Redirect to live listing 
          this.router.navigate(['market', this.auction.id]);

          // Create activity for the new auction
          this.auth.getAccountId().pipe(
            switchMap(accountId => this.activityUtils.createActivityModel(accountId || '', ActivityType.CREATE_AUCTION, this.auction)),
          ).subscribe(activity => {
            // Create the activity
            this.activities.create(activity).subscribe((success) => { });
          });

        } else {
          // Notify user of failure
          alert('Failed to save auction. Please try again.');
        }
      });
    } else {
      // Update the auction
      this.auctions.update(this.auction).subscribe(success => {
          // Check if successful
          if (success) {
            // Redirect to live listing 
            this.router.navigate(['market', this.auction.id]);
          } else {
            // Notify user of failure
            alert('Failed to save auction. Please try again.');
          }
      });
    }
  }

  // Convert the image form control to base64
  protected getBase64(): string {
    return this.url.split(',')[1];
  }
}
