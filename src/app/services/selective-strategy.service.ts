import { Injectable } from '@angular/core';
import { Route, PreloadingStrategy } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectiveStrategy implements PreloadingStrategy {

  // tslint:disable-next-line:ban-types
  preload(route: Route, load: Function): Observable<any> {

    if (route.data && route.data.preload) {
      return load();
    }

    return of(null);
  }

}
