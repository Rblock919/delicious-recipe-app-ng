import { Component, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss']
})
export class StarComponent implements OnInit, OnChanges {
  @Input()
  rating = 0;
  starWidth = 0;

  ngOnChanges(): void {
    this.starWidth = this.rating * 75 / 5;
  }

  constructor() { }

  ngOnInit() {
  }

}
