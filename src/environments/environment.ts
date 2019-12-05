// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Local
  path: 'http://localhost:3000/api/'
  // path: 'https://localhost:3000/api/'
  // Static Local Pi Address
  // path: 'http://192.168.1.5:3000/api/'
  // Static Local desktop address, used for testing cross domain functionality between angular & node server
  // path: 'http://192.168.1.7:3000/api/'
  // Heroku hosted uri of recipe-app
  // path: 'https://delicious-recipe-app.herokuapp.com/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
