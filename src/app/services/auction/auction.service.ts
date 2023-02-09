import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import Auction from 'src/app/models/auction.model';
import Bid from 'src/app/models/bid.model';
import { DaprService } from '../dapr.service';
import { BidStatus } from './bid-status.enum';

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
  public create(auction: Auction): Observable<boolean> {
    // The url
    let url = `${this.baseUrl}`;

    // Make the request
    return this.http.post(url, auction, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status == 201),
        catchError(error => of(false))
      );
  }

  // Update an auction
  public update(auction: Auction): Observable<boolean> {
    // The url
    let url = `${this.baseUrl}`;

    // Make the request
    return this.http.put(url, auction, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status == 204),
        catchError(error => of(false))
      );
  }

  // Delete an auction
  public delete(id: string): Observable<boolean> {
    // The url
    let url = `${this.baseUrl}/${id}`;

    // Make the request
    return this.http.delete(url, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status == 204),
        catchError(error => of(false))
      );
  }

  // Get all bids for an auction
  public getBids(id: string): Observable<Bid[]> {
    // The url
    let url = `${this.baseUrl}/${id}/bids`;

    // Make the request
    return this.http.get<Bid[]>(url, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.body as Bid[]),
        catchError(error => of([]))
      );
  }

  // Create a bid for an auction
  //
  // Returns the status code of the request:
  //  201 - Bid created
  //  404 - Auction not found
  //  406 - Auction expired
  //  409 - Bid is too low
  //  500 - Internal server error
  public createBid(id: string, bid: Bid): Observable<BidStatus> {
    // The url
    let url = `${this.baseUrl}/${id}/bids`;

    // Make the request
    return this.http.post(url, bid, { headers: this.defaultHeaders, observe: 'response' })
      .pipe(
        map(res => res.status as BidStatus),
        catchError(error => of(error.status as BidStatus))
      );
  }
}
