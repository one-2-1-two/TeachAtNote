import { ISemester, IHolidays, IWeekSchedule, IClassdate, IClassdateEvent, IHoliday, IPageInBatch } from '../helper/INotes';
import moment from 'moment';
// var fs = require('fs').promises;
import { promises as fs } from 'fs';
// import * as fs from 'fs';
// var fs = require('fs');

function makeClassdatesLoop( FW: number, LW: number, startOfYear: moment.Moment, 
                             lessonSchedule: IClassdate[],
                             holidays: IHolidays,  
                             classdates: IClassdateEvent[] ) {
    for (let i = FW; i <= LW; i++) {
        const ithWeek = moment(startOfYear).week(i);
        lessonSchedule.forEach((classdate: IClassdate) => {
            const weekSchedule: IWeekSchedule = classdate.weekSchedule;
            if (isWeekOn(i, weekSchedule)) {
                let day = ithWeek.locale('en').day(classdate.day);
                day.hour(classdate.time.getHours());
                day.minute(classdate.time.getMinutes());
                let isDateIn = isDateInGen(day);
                if (holidays.findIndex(isDateIn, day) < 0) {
                    const classdateMoment : moment.Moment = moment(day);
                    const classdateEvent : IClassdateEvent = {
                        day: classdateMoment,
                        number: classdate.number 
                    }
                    classdates.push(classdateEvent); 
                };
            };    
        });
    };                            
}

export function makeClassdates(semester: ISemester, holidays: IHolidays, lessonSchedule: IClassdate[]) {
    // german locale
    moment.locale('de');

    var start = moment(semester.start);
    // [F]irst [W]eek [F]irst [S]emester
    const FWFS = start.week();
    // [L]ast [W]eek [F]irst [S]emester
    const LWFS = start.weeksInYear(); // Note: the last days of a year may have week number=1

    var end = moment(semester.end);
    // [L]ast [W]eek [S]econd [S]emester
    const LWSS = end.week();
    // [F]irst [W]eek [S]econd [S]emester
    const FWSS = 1;//end.startOf('year').week();
    
    var classdates: IClassdateEvent[] = [];

    let year: number = semester.start.year();
    let startOfYear = moment().year(year).startOf('year').add(7, 'days').startOf('week')
    // let startOfYear: moment.Moment = moment().year(year).startOf('year').isoWeek(1).startOf('week');

    // loop over weeks of first semester
    makeClassdatesLoop(FWFS, LWFS, startOfYear, lessonSchedule, holidays, classdates);
    // for (let i = FWFS; i <= LWFS; i++) {
    //     const ithWeek = startOfYear.week(i);
    //     lessonSchedule.forEach((classdate: IClassdate) => {
    //         const weekSchedule: IWeekSchedule = classdate.weekSchedule;
    //         if (isWeekOn(i, weekSchedule)) {
    //             let day = ithWeek.locale('en').day(classdate.day);
    //             day.hour(classdate.time.getHours());
    //             day.minute(classdate.time.getMinutes());
    //             let isDateIn = isDateInGen(day);
    //             if (holidays.findIndex(isDateIn, day) < 0) {
    //                 const classdate = moment(day);
    //                 classdates.push(classdate); 
    //             };
    //         };    
    //     });
    // };

    // second semester
    year = semester.end.year();
    startOfYear = moment().year(2021).startOf('year').add(7, 'days').startOf('week')
    // startOfYear = moment().year(year).startOf('year').isoWeek(1).startOf('week');
    makeClassdatesLoop(FWSS, LWSS, startOfYear, lessonSchedule, holidays, classdates);
    // loop over second semester
    // for (let i = FWSS; i <= LWSS; i++) {
    //     const ithWeek = startOfYear.week(i);
    //     lessonSchedule.forEach((classdate: IClassdate) => {
    //         const weekSchedule: IWeekSchedule = classdate.weekSchedule;
    //         if (isWeekOn(i, weekSchedule)) {
    //             let day = ithWeek.locale('en').day(classdate.day);
    //             day.hour(classdate.time.getHours());
    //             day.minute(classdate.time.getMinutes());
    //             let isDateIn = isDateInGen(day);
    //             if (holidays.findIndex(isDateIn, day) < 0) {
    //                 const classdate = moment(day);
    //                 classdates.push(classdate);
    //             };
    //         };
    //     });
    // };
    
    return classdates;
};

export function classdatesToPages(classdateEvents: IClassdateEvent[], sectionID: string) : IPageInBatch[][] {
    let pages: IPageInBatch[] = [];
    let pageBatches: IPageInBatch[][] = [];
    let graphCreatePageEndpoint = "/me/onenote/sections/" + sectionID + "/pages";
    const createTime = moment().format();
    let ctr: number = 1; 
    let prevCtr: number = 0;
    classdateEvents.forEach(classdate => {
        const time: string = classdate.day.format('dddd[,] D[.]MMMM YYYY');
        let hours: string = '';
        if (parseInt(classdate.number) === 1) {
            hours = '1 Stunde';
        } else {
            hours = classdate.number + ' Stunden';
        };
        let dependant: string[] = [];
        if (ctr % 20 !== 1) {
            dependant = [ prevCtr.toString() ];
        }
        const pageBody: string = 
        `<html>
            <head>
                <title> ${time}, ${hours} </title>
                <meta name="created" content="${createTime}" />
            </head>
        </html>`;
        let page: IPageInBatch = {
            id: ctr.toString(),
            dependsOn: dependant,
            method: "POST",
            url: graphCreatePageEndpoint,
            headers: {
                "Content-Type": "application/xhtml+xml"
            },
            body: btoa(pageBody)
        }
        pages.push(page)
        if (ctr % 20 === 0) {
            pageBatches.push(pages);
            pages = [];
        }
        prevCtr = ctr;
        ctr += 1;
    });

    return pageBatches;
};

export function isWeekOn(weekNo: number, weekSchedule: IWeekSchedule) {
    const patternLength: number = weekSchedule.pattern.length;
    const rem: number = (weekNo - weekSchedule.startNo) % patternLength;
    if (weekSchedule.pattern[rem] > 0) {
        return true;
    } else {
        return false;
    }
};

export function isDateInGen(day: moment.Moment) {
    function isDateIn(event: IHoliday, index: number, obj: IHolidays) {
        return (event["start"].isSameOrBefore(day, 'day') &&
                event["end"  ].isSameOrAfter( day, 'day'));
    }
    return isDateIn; 
}
// var _this = this;
// export function isDateIn(event: IHoliday, index: number, obj: IHolidays) {
//     // var _this = this;
//     return (event["start"].isSameOrBefore(_this, 'day') &&
//             event["end"].isSameOrAfter(_this, 'day'));
// }

export function getNextSchoolday(date: moment.Moment, fwd: boolean) : moment.Moment {
    var nextDate: moment.Moment = moment(date);
    while ([1, 2, 3, 4, 5].indexOf(nextDate.get('day')) < 0) {
        if (fwd) {
            nextDate.add(1, 'day');
        } else {
            nextDate.subtract(1, 'day');
        }
    }
    return nextDate;
}

// const holidaysEnum : IHolidaysEnum = {
//     OST: 'Osterferien',
//     PFI: 'Pfingstferien',
//     SOM: 'Sommerferien',
//     HER: 'Herbstferien',
//     WEI: 'Weihnachtsferien',
//     UNDEF: 'Unbekannt'
// };
// const holidaysEnum : { [name: string]: string } = {
//     'OST': 'Osterferien',
//     'PFI': 'Pfingstferien',
//     'SOM': 'Sommerferien',
//     'HER': 'Herbstferien',
//     'WEI': 'Weihnachtsferien',
//     'UNDEF': 'Unbekannt'
// };
const holidaysEnum : { [name: string]: string } = {
    OST: 'Osterferien',
    PFI: 'Pfingstferien',
    SOM: 'Sommerferien',
    HER: 'Herbstferien',
    WEI: 'Weihnachtsferien',
    UNDEF: 'Unbekannt'
};

const provincesEnum : { [name: string]: string } = {
    BAW: 'Baden-Württemberg',
    BAY: 'Bayern',
    BER: 'Berlin',
    BRA: 'Brandenburg',
    BRE: 'Bremen',
    HAM: 'Hamburg',
    HES: 'Hessen',
    MEV: 'Mecklenburg-Vorpommern',
    NIE: 'Niedersachen',
    NRW: 'Nordrhein-Westfalen',
    RNP: 'Reinland-Pfalz',
    SAR: 'Saarland',
    SXN: 'Sachsen',
    SAN: 'Sachsen-Anhalt',
    SWH: 'Schleswig-Holstein',
    THU: 'Thüringen',
    UNDEF: 'Unbekannt'
};

function getProvinceKey(summary: string) {
    let province: string = provincesEnum.UNDEF;
    for (const provinceKey in provincesEnum) {
        if (summary.includes(provincesEnum[provinceKey])) {
            province = provinceKey;
            break;
        }
    };
    return province;
}

function getHolidayKey(summary: string) {
    let holiday: string = holidaysEnum.UNDEF;
    for (const holidayKey in holidaysEnum) {
        if (summary.includes(holidaysEnum[holidayKey])) {
            holiday = holidayKey;
            break;
        }
    }
    return holiday;
}

export function getSemester(yearKey: number, holidays: IHolidays) : ISemester {
    let semester: ISemester = { start: moment(), end: moment() };
    var firstDay = moment(getHoliday(yearKey, holidaysEnum.SOM, holidays)?.end);
    firstDay = getNextSchoolday(firstDay.add(1, 'day'), true);
    var lastDay = moment(getHoliday(yearKey + 1, holidaysEnum.SOM, holidays)?.start);
    lastDay = getNextSchoolday(lastDay.subtract(1, 'day'), false);
    semester['start'] = firstDay;
    semester['end']   = lastDay;
    return semester;
}

// get the holiday identified by yearKey and holidayKey from the holidays object (array of holiday object)
function getHoliday(yearKey: number, holidayKey: string, holidays: IHolidays) : IHoliday | undefined{
    var holiday = undefined;
    const momentKey = moment([yearKey]);
    // console.log(momentKey);
    for (const ithHoliday of holidays) {
        // const vara: string = ithHoliday.holiday;
        // holidaysEnum[vara];
        if (holidaysEnum[ithHoliday.holiday] === holidayKey && ithHoliday.start.isSame(momentKey, 'year')) {
            holiday = ithHoliday;
            break;
        }
    }
    return holiday;
}

export async function readHolidayFiles(filenames: string[], holidayDict: IHolidays) {
    try {
        for (const filename of filenames) {
            const json = await fs.readFile(filename, 'utf8' );
            try {
                const holidays = JSON.parse(json);
                holidays.VCALENDAR[0].VEVENT.forEach((event: any) => {
                    const dtStart = event["DTSTART;VALUE=DATE"];
                    const dtEnd   = event["DTEND;VALUE=DATE"];
                    const summary = event["SUMMARY"];
                    const momStart = moment(dtStart, 'YYYYMMDD');
                    const momEnd   = moment(dtEnd,   'YYYYMMDD');
                    const province = getProvinceKey(summary);
                    const holiday = getHolidayKey(summary);
                    const eventObj = { 'start': momStart, 'end': momEnd, 'holiday': holiday, 'province': province  };
                    holidayDict.push(eventObj);
                    // console.log(eventObj);
                });
                // console.log(holidayDict.findIndex(isDateIn, moment('20200602', 'YYYYMMDD')));
                // console.log(getHoliday(2020, holidaysEnum.SOM, holidayDict).end);
                // console.log(holidayDict);
            } 
            catch(err) {
                console.log('Error parsing JSON string:', err)
            };
        };
        // console.log(holidayDict);
    } 
    catch (err) {
        console.log("Error reading file from disk:", err)
    }
};

// export async function readHolidayFiles(filenames: string[], holidayDict: IHolidays) {
//     await readHolidayFile(filenames, holidayDict);
// };

export function readHolidayFilesSync(filenames: string[], holidayDict: IHolidays) {
    readHolidayFiles(filenames, holidayDict)
    .then( () => {
          return true;
        }
    ).catch( () => {
        return false;
        }
    );
};
