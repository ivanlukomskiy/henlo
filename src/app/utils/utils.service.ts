import {Injectable} from '@angular/core';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

@Injectable({
    providedIn: 'root'
})
export class UtilsService {


    constructor() {
    }

    public truncateHours(date) {
        const truncated = new Date(date);
        truncated.setHours(0, 0, 0, 0);
        return truncated;
    }

    public datePretty(date: Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();

        const truncated = this.truncateHours(date).getTime();
        const diff = (todayTime - truncated) / 24 / 60 / 60 / 1000;
        if (diff === 0) {
            return 'Today';
        } else if (diff === 1) {
            return 'Yesterday';
        } else if (diff < 20) {
            return diff + ' days ago';
        } else if (today.getFullYear() === date.getFullYear()) {
            return date.getDate() + ' ' + monthNames[date.getMonth()];
        } else {
            return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
        }
    }

    public shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }


    public sortAndGroup(translations) {
        const self = this;
        translations.sort((a, b) => b.added.getTime() - a.added.getTime());

        const translationsByDates = {};
        translations.forEach(a => {
            const date = self.truncateHours(a.added);
            const key = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
            if (!translationsByDates.hasOwnProperty(key)) {
                translationsByDates [key] = {date, translations: []};
            }
            translationsByDates [key].translations.push(a);
        });
        return translationsByDates;
    }
}
