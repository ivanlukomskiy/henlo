import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'fi-draft',
  templateUrl: './fi-draft.component.html',
  styleUrls: ['./fi-draft.component.scss'],
})
export class FiDraftComponent implements OnInit {

  constructor() { }

  @Input() active = false;

  ngOnInit() {}

}
