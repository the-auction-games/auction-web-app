import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from '../models/activity.model';
import { ActivityUtils } from '../services/utils/activity.utils';

@Component({
  selector: 'grid-view-activity',
  templateUrl: './grid-view-activity.component.html',
  styleUrls: ['./grid-view-activity.component.css']
})
export class GridViewActivityComponent {

  // The activity
  @Input() activity: Activity | undefined;

  // The icon
  protected icon: string = '';

  // Activity age
  protected age: string = '';

  // Constructor
  constructor(
    private utils: ActivityUtils,
    private router: Router
  ) { }

  // On init
  ngOnInit(): void {
    // Set the icon
    this.icon = this.utils.getIcon(this.activity);

    // Set the age
    this.age = this.utils.getActivityAge(this.activity);
  }

  // On view
  protected onView(): void {
    this.router.navigate([this.activity?.urlRedirect]);
  }
}
