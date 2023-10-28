# Front

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

# Installation

NodeJs must be installed on computer (version between 16.13 and 18.18 recommended) that can be found on https://www.nodejs.org

In command prompt positioned in folder where the application has been cloned, use the command line `npm install` to install all necessary packages.

## Development server

Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

For testing the application on a mobile device connected to the same network, the ip address of computer running the code on local network is needed. If unknown, open a command prompt and type `ipconfig`, locate the IPv4 (usually starting with 192.168), copy and paste it to replace `localhost` in the property baseUrl of the file constants.ts located in the src/app folder, then execute the command `ng serve --host 0.0.0.0`. 
The application can then be used on any device connected to the same network by accessing the address http://IP_ADDRESS:4200

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

