import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    trs = [];

    // trs = [
    //     {
    //         ori: 'table',
    //         tra: 'стол',
    //         added: new Date(1572939391)
    //     },
    //     {
    //         ori: 'beach',
    //         tra: 'пляж',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'dog',
    //         tra: 'пёс',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'little sneaky biting bastartd with a fluffy tail',
    //         tra: 'кот',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'stomp',
    //         tra: 'топать',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'stock',
    //         tra: 'склад',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'cope',
    //         tra: 'справляться',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'pledge',
    //         tra: 'обещание, символ',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'get up the nerve',
    //         tra: 'собраться с силами',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'beaber',
    //         tra: 'бобр',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'axe',
    //         tra: 'топор',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'bite the bullet',
    //         tra: 'сделать что-либо неприятное',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'smash',
    //         tra: 'разбить',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'heel',
    //         tra: 'каблук',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'fox',
    //         tra: 'лиса',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'delirious',
    //         tra: 'быть в помутнённом сознании',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'tortoise',
    //         tra: 'черепаха',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'caniferous',
    //         tra: 'хвойный',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'foliar, deciduous',
    //         tra: 'лиственный',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'cramped',
    //         tra: 'тесный',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'seamless',
    //         tra: 'бесшовно',
    //         added: new Date(1572949391)
    //     },
    //     {
    //         ori: 'scrutinize',
    //         tra: 'исследовать тщательно',
    //         added: new Date(1572949391)
    //     },
    // ];

    constructor(private storage: Storage) {
    }

    ngOnInit(): void {
        // const _self = this;
        // _self.storage.get('kek')
        //     .then(val => {
        //         console.log('Value is ', val);
        //         _self.kek = val;
        //         return _self.storage.set('kek', val === null ? 1 : val + 1);
        //     });
        // this.storage.set('kek', 3);
    }

}
