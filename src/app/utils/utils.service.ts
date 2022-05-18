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

    public countTodayTranslations(translations) {
        const self = this;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        return translations
            .filter(tr => self.truncateHours(tr.added).getTime() === todayTime)
            .filter(tr => !tr.deleted)
            .filter(tr => !self.isDraft(tr))
            .length;
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
        } else if (diff < 7) {
            return diff + ' days ago';
        } else if (today.getFullYear() === date.getFullYear()) {
            return monthNames[date.getMonth()] + ' ' + date.getDate();
        } else {
            return monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        }
    }

    public shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    public organize(translations) {
        const self = this;
        translations = translations.filter(translation => !translation.deleted);
        translations.sort((a, b) => b.added - a.added);

        const result = {
            stats: {
                translationsThisDay: 0,
                translationsThisMonth: 0,
                translationsThisYear: 0,
                translationsTotal: 0
            },
            translationsByDates: {}
        };

        const today = self.truncateHours(new Date());
        const thisDate = today.getDate();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();

        const translationsByDates = {};
        translations.forEach(translation => {
            const date = self.truncateHours(translation.added);
            const key = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
            if (!translationsByDates.hasOwnProperty(key)) {
                translationsByDates [key] = {date, translations: []};
            }
            translationsByDates [key].translations.push(translation);

            if (self.isDraft(translation)) {
                return;
            }
            result.stats.translationsTotal += 1;
            if (date.getFullYear() === thisYear) {
                result.stats.translationsThisYear += 1;
                if (date.getMonth() === thisMonth) {
                    result.stats.translationsThisMonth += 1;
                    if (date.getDate() === thisDate) {
                        result.stats.translationsThisDay += 1;
                    }
                }
            }
        });
        result.translationsByDates = translationsByDates;
        return result;
    }

    public isDraft(translation) {
        return translation.original === '' || translation.translation === '';
    }

    public isEnglish(text) {
        // rough, but fine for now
        return text.replace(/[a-zA-Z]+/g, '').length < text.length / 2;
    }
}
