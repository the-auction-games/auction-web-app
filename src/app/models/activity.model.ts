import { ActivityType } from "../services/activity/activity-type.enum";

// A model for handling activity data
export interface Activity {
    id: string,
    userId: string,
    type: ActivityType,
    description: string,
    urlRedirect: string,
    creationTimestamp: number
};