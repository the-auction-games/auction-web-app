import { Component, Input } from '@angular/core';
import { Activity } from '../models/activity.model';

@Component({
  selector: 'activity-grid',
  templateUrl: './activity-grid.component.html',
  styleUrls: ['./activity-grid.component.css']
})
export class ActivityGridComponent {

  // Get activity
  @Input() activity: Activity[] = [];

  // Constructor
  constructor() { }

}
