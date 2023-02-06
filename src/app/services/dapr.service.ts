import { HttpHeaders } from "@angular/common/http";

// Base class with utility methods for dapr microservices.
export abstract class DaprService {

    // Default headers
    protected defaultHeaders: HttpHeaders = new HttpHeaders();

    // Construct the dapr microservice
    constructor() {
        // Set the default headers
        this.defaultHeaders = this.defaultHeaders.set('Content-Type', 'application/json');
    }
}