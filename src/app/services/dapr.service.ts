import { HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

// Base class with utility methods for dapr microservices.
export abstract class DaprService {

    // Default headers
    protected defaultHeaders: HttpHeaders = new HttpHeaders();

    // Construct the dapr microservice
    constructor() {
        // Set the default headers
        this.defaultHeaders = this.defaultHeaders.set('Content-Type', 'application/json');
    }

    // Get the url for a dapr sidecar
    public getSidecarUrl(service: string, method: string): string {

        // The dapr sidecar url and port the front end communicates with
        let isProduction = environment.production;
        let url = environment.sidecarHost;
        let port = environment.sidecarPort;

        let protocol = (port == 443 ? 'https' : 'http') + '://';
        let namespace = isProduction ? '.default' : '';

        // Return the url
        return `${protocol}${url}:${port}/v1.0/invoke/${service}${namespace}/method/${method}`;
    }
}