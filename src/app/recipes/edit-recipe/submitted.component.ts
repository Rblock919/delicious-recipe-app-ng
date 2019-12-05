import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submitted',
  template: `
  <div class="container" style="padding-bottom: 30px">
    <div class="row">
      <div class="col-md-12">
        <div class="well well-lg">
          <div class="row">
            <div class="col-sm-12 text-center">
            <h1>Thank you for submitting a recipe.</h1> <br>
            <h1>An admin will review your submitted recipe shortly.</h1>
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
export class SubmittedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
