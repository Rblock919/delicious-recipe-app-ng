import { Injectable } from '@angular/core';

@Injectable()
// { providedIn: 'root' }
export class LoggerService {
  constructor() {}

  consoleLog(message: string): void {
    console.log(message);
  }

  consoleError(message: string): void {
    console.error(message);
  }

  fileLog(message: string): void {
    // TODO: implement logging to a file
  }

  fileError(message: string): void {
    // TODO: implement logging to an error file
  }
}
