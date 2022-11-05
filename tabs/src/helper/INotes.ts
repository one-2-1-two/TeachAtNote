import moment from "moment";

export interface IWeekSchedule {
    pattern: number[];
    startNo: number;
}

export interface IClassdate {
    day: string;
    time: Date;
    number: string;
    weekSchedule: IWeekSchedule;
    id: string;
}

export interface IClassdateEvent {
    day: moment.Moment;
    number: string;
}

export interface ISemester {
    start: moment.Moment;
    end: moment.Moment;
}

export interface IHoliday {
    start: moment.Moment;
    end: moment.Moment;
    holiday: string;
    province: string;
}

export interface IHolidays extends Array<IHoliday>{};

export interface IUser {
    user: {id: string, displayName: string}
}

export interface ILinks {
    oneNoteClientUrl: {href: string}
    oneNoteWebUrl: {href: string}
}

// confirmed 2020-07-15 by comparison with response of get notebooks 
export interface INotebookInfo {
    id: string;
    self: string;
    createdDateTime: string;
    displayName: string;
    lastModifiedDateTime: string;
    isDefault: boolean;
    userRole: string;
    isShared: boolean;
    sectionsUrl: string;
    sectionGroupsUrl: string;
    createdBy: IUser;
    lastModifiedBy: IUser;
    links: ILinks;
}

export interface ISectionGroupInfo {
    id: string;
    self: string;
    displayName: string;
    sectionsUrl: string;
    sectionGroupsUrl: string;
    createdBy: IUser;
    createdDateTime: string;
    lastModifiedBy: IUser;
    lastModifiedDateTime: string;
}

export interface ISectionInfo {
    id: string;
    self: string;
    displayName: string;
    pagesUrl: string;
    createdBy: IUser;
    createdDateTime: string;
    lastModifiedBy: IUser;
    lastModifiedDateTime: string;
    isDefault: boolean;
    links: ILinks;
}

export interface IPageInfo {
    id: string;
    self: string;
    title: string;
    // content: string; // get page has no such property
    contentUrl: string;
    createdByAppID: string;
    createdDateTime: string;
    // lastModifiedBy: IUser;
    lastModifiedDateTime: string;
    // isDefault: boolean;
    links: ILinks;
    parentSection: string;
    "parentSection@odata.context": string;
    // level: number;
    // order: number;
}

export interface IHeaderInBatch {
    "Content-Type": string;
}

export interface IPageInBatch {
    id: string;
    dependsOn: string[];
    method: string;
    url: string;
    headers: IHeaderInBatch;
    body: string;
}
