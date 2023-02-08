import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import Auction from 'src/app/models/auction.model';
import { DaprService } from '../dapr.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionService extends DaprService {

  // Base url
  private baseUrl: string = 'http://localhost:3504/v1.0/invoke/auctionapi/method/api/v1/auctions';

  // Construct the account validation service with an http client.
  constructor(private http: HttpClient) {
    super();
  }

  // Get all auctions
  public getAll(): Observable<Auction[]> {
    // The url
    let url = `${this.baseUrl}`;

    // Make the request
    return this.http.get<Auction[]>(url, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.body as Auction[]),
        catchError(error => of([]))
      );
  }

  // Get auction by id
  public get(id: string): Observable<Auction | null> {
    // The url
    let url = `${this.baseUrl}/${id}`;

    // Make the request
    return this.http.get<Auction>(url, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.body as Auction),
        catchError(error => of(null))
      );
  }

  // Create an auction

  // Update an auction
  
  // Delete an auction

  // Get all bids for an auction

  // Create a bid for an auction

}
