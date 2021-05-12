# Engage Seed App

## Technologies Used
1. [Angular](https://angular.io/)
2. [Express](https://expressjs.com/)
3. [Angular CLI](https://cli.angular.io/)
4. [Webpack](https://webpack.js.org/)
5. [Sentry](https://sentry.io/)
6. [AWS SDK for Javascript](https://aws.amazon.com/sdk-for-javascript/)
7. [Bootstrap](https://getbootstrap.com/)
8. Logging Libraries - [Bunyan](https://www.npmjs.com/package/bunyan) and [Morgan](https://www.npmjs.com/package/morgan)
9. [comproDLS SDK](https://www.npmjs.com/package/comprodls-sdk)
10. [Redis](https://redis.io/)
11. [Passport](http://www.passportjs.org/)
12. Security Libraries - [csurf](https://www.npmjs.com/package/csurf), [Helmet](https://helmetjs.github.io/), [frameguard](https://www.npmjs.com/package/frameguard)

## Setting up development environment
### Pre-requisites
1. Install [GIT](https://git-scm.com/downloads)
2. Install [NodeJS](https://nodejs.org/en/download/) version 14.15.0

### Setting up local server
1. Clone GitHub repository using following command
```
git clone git@bitbucket.org:comprodls/engage-seed-app.git
```
    
2. Go to the root folder of above cloned repository

3. Install the required dependencies using following command
```
npm install
```

4. Start the local web server using following command
```
npm start
```

5. Navigate to following link in your browser to view application. The app will automatically reload if you change any of the source files.
```
http://localhost:8080
```

### Building the app

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


