import { Activity } from "../../models/activity.model";
import { v4 as uuidv4 } from 'uuid';
import { ActivityType } from "../activity/activity-type.enum";
import { AccountService } from "../account/account.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { map, switchMap } from "rxjs";
import Auction from "src/app/models/auction.model";
import { AuthService } from "../auth/auth.service";
import { Account } from "src/app/models/account.model";

// Utility class for activities
@Injectable({
    providedIn: 'root'
})
export class ActivityUtils {

    // Inject the account service
    constructor(
        private accounts: AccountService
    ) { }

    // Utility method for creating an activity
    public createActivityModel(accountId: string, type: ActivityType, auction?: Auction): Observable<Activity> {

        // Create the activity model   
        let activity = this.accounts.getById(accountId != null ? accountId : '').pipe(
            map(account => {
                return this.getActivityModel(account != null ? account : undefined, type, auction);
            })
        );

        // Return the activity
        return activity;
    }

    // Get the new activity model
    private getActivityModel(account: Account | undefined, type: ActivityType, auction?: Auction): Activity {
        // Get the account name
        let accountId = account?.id || '';
        let accountName = account?.name || 'Unknown'

        // The description & url redirect
        let description: string = '';
        let urlRedirect: string = '';

        // Set the description & url redirect
        switch (type) {
            case ActivityType.CREATE_ACCOUNT:
                description = `${accountName} created a new account`;
                urlRedirect = `/account/${accountId}`;
                break;
            case ActivityType.CREATE_AUCTION:
                description = `${accountName} created a new auction`;
                urlRedirect = `/market/${auction?.id}`;
                break;
            case ActivityType.CREATE_BID:
                description = `${accountName} place a bid on an auction`;
                urlRedirect = `/market/${auction?.id}`;
                break;
            case ActivityType.PURCHASE_AUCTION:
                description = `${accountName} purchased an auction`;
                urlRedirect = `/market/${auction?.id}`;
                break;
        };

        // Return the new activity
        return {
            id: uuidv4(),
            userId: accountId,
            type: type,
            description: description,
            urlRedirect: urlRedirect,
            creationTimestamp: new Date().getTime()
        };
    }

    // Get the icon associated with the activity
    public getIcon(activity?: Activity): string {

        // Return the icon
        switch (activity?.type || '') {
            case ActivityType.CREATE_ACCOUNT:
                return 'fa-solid fa-user fa-2xl fa-fw';
            case ActivityType.CREATE_AUCTION:
                return 'fa-solid fa-shopping-cart fa-2xl fa-fw';
            case ActivityType.CREATE_BID:
                return 'fa-solid fa-money-bill-wave fa-2xl fa-fw';
            case ActivityType.PURCHASE_AUCTION:
                return 'fa-solid fa-gavel fa-2xl fa-fw';
            default:
                // Unknown
                return 'fa-solid fa-question fa-2xl fa-fw';
        }
    }

    // Get how long ago the activity was created
    public getActivityAge(activity?: Activity): string {
        // Check if the activity is valid
        if (!activity) return '';

        // Get the difference in milliseconds
        let created: number = activity.creationTimestamp;
        let now: number = new Date().getTime();
        let diff: number = now - created;

        // Get the difference in seconds
        let diffSeconds: number = Math.floor(diff / 1000);

        // Get the difference in minutes
        let diffMinutes: number = Math.floor(diffSeconds / 60);

        // Get the difference in hours
        let diffHours: number = Math.floor(diffMinutes / 60);

        // Get the difference in days
        let diffDays: number = Math.floor(diffHours / 24);

        // Get the difference in weeks
        let diffWeeks: number = Math.floor(diffDays / 7);

        // Get the difference in months
        let diffMonths: number = Math.floor(diffDays / 30);

        // Get the difference in years
        let diffYears: number = Math.floor(diffDays / 365);

        // Return the time ago
        if (diffYears > 0) return `${diffYears}y ago`;
        if (diffMonths > 0) return `${diffMonths}mo ago`;
        if (diffWeeks > 0) return `${diffWeeks}w ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        if (diffMinutes > 0) return `${diffMinutes}m ago`;

        // Return just now
        return 'Just Now';
    }
}