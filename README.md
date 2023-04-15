# Auction Web App
This is the front-facing Angular web application for The Auction Games. This application hooks into the four microservices that make up the backend of the application. Additionally, this application depends on Dapr for service discovery and routing.

## Project Structure
The project is structured as follows:
```
.
├── src/                    'Source files'
│   ├── app/                'Main application'
│   │   ├── components/     'Components'
│   │   ├── models/         'Models'
│   │   └── services/       'Services for API access, etc.'
│   ├── assets/             'Static assets'
│   └── environments/       'Environment configurations'
├── angular.json            'Angular configuration'
├── package.json            'NPM configuration'
├── tsconfig.json           'TypeScript configuration'
└── README.md               'This file'
```