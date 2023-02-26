import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Activity } from 'src/app/models/activity.model';
import { DaprService } from '../dapr.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService extends DaprService {
  // Base url
  private baseUrl: string = 'http://localhost:3504/v1.0/invoke/activityapi/method/api/v1/activity';

  // Construct the account validation service with an http client.
  constructor(private http: HttpClient) {
    super();
  }

  // Get activity
  public getAll(limit?: number): Observable<Activity[]> {
    // The url
    let url = `${this.baseUrl}`;

    // The params
    let params = {};
    if (limit) params = { limit: limit };

    // Make the request
    return this.http.get<Activity[]>(url, { headers: this.defaultHeaders, params: params, observe: 'response' })
      .pipe(
        map(res => res.body as Activity[]),
        catchError(error => of([]))
      );
  }

  // Get activity for userid
  public getForUser(userId: string, limit?: number): Observable<Activity[]> {
    // The url
    let url = `${this.baseUrl}/user/${userId}`;

    // The params
    let params = {};
    if (limit) params = { limit: limit };

    // Make the request
    return this.http.get<Activity[]>(url, { headers: this.defaultHeaders, params: params, observe: 'response' })
      .pipe(
        map(res => res.body as Activity[]),
        catchError(error => of([]))
      );
  }

  // Create an activity
  public create(activity: Activity): Observable<boolean> {
    // The url
    let url = `${this.baseUrl}`;

    // Make the request
    return this.http.post(url, activity, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status == 201),
        catchError(error => of(false))
      );
  }
}
