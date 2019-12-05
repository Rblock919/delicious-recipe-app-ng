import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  template: `
  <div class="container" style="padding-bottom: 30px">
    <div class="row">
      <div class="col-md-12">
        <div class="well well-lg">
          <div class="row">
            <div class="col-sm-12 text-center">
            <h1>You have been logged out.</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
  </div>
`,
  styles: ['']
})
export class LogoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
