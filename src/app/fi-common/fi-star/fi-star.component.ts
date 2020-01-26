import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'fi-star',
    templateUrl: './fi-star.component.html',
    styleUrls: ['./fi-star.component.scss'],
    animations: [
        trigger('simpleFadeAnimation', [

            // the "in" style determines the "resting" state of the element when it is visible.
            state('visible', style({transform: 'scale(1)', opacity: 1})),
            state('hidden', style({transform: 'scale(0.1)', opacity: 0})),

            // fade in when created. this could also be written as transition('void => *')
            transition('visible => hidden', [animate(100)]),

            // fade out when destroyed. this could also be written as transition('void => *')
            transition('hidden => visible', [animate(100)])
        ])
    ]
})
export class FiStarComponent implements OnInit {
    @Input() visible = null;

    constructor() {
    }

    ngOnInit() {
    }

}
