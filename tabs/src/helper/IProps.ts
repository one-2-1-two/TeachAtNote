import { IClassdate, IHolidays } from './INotes';

export interface ILessonPlanNotebookHierProps {
    selSectionID: string;
    selSectionIDOnChange: (value: string) => void;
    selSectionGroupID: string;
    selSectionGroupIDOnChange: (value: string) => void;
    selNotebookID: string;
    selNotebookIDOnChange: (value: string) => void;
  }
  
export interface ISettingsProps {
    province: string;
    selProvinceOnChange: (value: string) => void;
}

export interface ISettingsState {
    // province: string;
}

// export interface ILessonPickerProps {
//     classdates: IClassdate[];
//     selDayOnChange: (ix: number, day: string) => void;
//     classdatesAdd: (newDate: IClassdate) => void;
//     classdatesRmv: (id: string) => void;
// }

export interface ILessonPlanTimeTableProps {
    classdates: IClassdate[];
    selDayOnChange: (ix: number, day: string) => void;
    classdatesAdd: (newDate: IClassdate) => void;
    classdatesRmv: (id: string) => void;
}

export interface ILessonPlanCreatorProps {
    classdates: IClassdate[];
    graphAccessToken: string;
    sectionID: string;
    holidays: IHolidays;
    year: number; // the first year of a schoolyear
}
