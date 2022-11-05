import { useContext, useState } from "react";

// import { ILessonPlanRootSel } from "../../helper/IState";
import { IClassdate, IHolidays } from "../../helper/INotes";
import { LessonPlanNotebookHier } from "./LessonPlanNotebookHier";
import { LessonPlanTimeTable } from "./LessonPlanTimeTable";

export function LessonPlanRoot(props: { }) {
    const {  } = {
      ...props,
    };

    // component states. these will be passes down to the sub-components LessonPlanNotebookSel, LessonPlanTimetable, and LessonPlanCreator
    const emptyClassdates : IClassdate[] = [];
    const emptyHolidays : IHolidays = [];
    const [selNotebook, setSelNotebook ] = useState( { selSectionID: '', selSectionGroupID: '', selNotebookID: '' } );
    const [classdates, setClassdates] = useState(emptyClassdates);
    const [province, setProvince] = useState('Hessen'); // read from local storage later
    const [holidays, setHolidays] = useState(emptyHolidays);

    // update state functions. these will be passed down to the sub-component
    function classdatesAdd(newDate: IClassdate) {
        setClassdates([...classdates, newDate]);
    };
    function classdatesRmv(id: string) {
        const ix : number = classdates.findIndex(el => el.id === id);
        let newClassdates = [...classdates];
        newClassdates.splice(ix, 1);
        setClassdates(newClassdates);
    };
    function classdatesSelDayOnChange(ix: number, day: string) {
        let newClassdates = [...classdates];
        newClassdates[ix].day = day;
        setClassdates(newClassdates);
    };
    function provinceOnChange(newProvince: string) {
        setProvince(newProvince)
    };
    function selSectionIDOnChange(newSectionID: string) {
        setSelNotebook({...selNotebook, selSectionID: newSectionID});
    };
    function selSectionGroupIDOnChange(newSectionGroupID: string) {
        setSelNotebook({...selNotebook, selSectionGroupID: newSectionGroupID});
    };
    function selNotebookIDOnChange(newNotebookID: string) {
        setSelNotebook({...selNotebook, selNotebookID: newNotebookID});
    };
    function holidaysOnChange(newHolidays: IHolidays) {
        setHolidays([...newHolidays]);
    };

    // function classdatesSelDayOnChange(ix: number, day: string) {
    //     let lclassdates = [...classdates];
    //     lclassdates[ix].day = day;
    //     setClassdates(lclassdates);
    //   }
    
    //   function classdatesAdd(newDate: IClassdate) {
    //     setClassdates([...classdates, newDate]);
    //   }
    
    //   function classdatesRmv(id: string) {
    //     const ix : number = classdates.findIndex(el => el.id === id);
    //     let lclassdates = [...classdates];
    //     lclassdates.splice(ix, 1);
    //     console.log('removing ' + id);
    //     setClassdates(lclassdates);
    //     console.log('number class dates in list' + classdates.length);
    //     // this.setState({classdates: [...this.state.classdates]});
    //   }
    // }
    return (
        <div>
            {/* <LessonPlanNotebookHier></LessonPlanNotebookHier> */}
            <LessonPlanNotebookHier selSectionID={selNotebook.selSectionID}
                                    selSectionIDOnChange={selSectionIDOnChange}
                                    selSectionGroupID={selNotebook.selSectionGroupID}
                                    selSectionGroupIDOnChange={selSectionGroupIDOnChange}
                                    selNotebookID={selNotebook.selNotebookID}
                                    selNotebookIDOnChange={selNotebookIDOnChange} ></LessonPlanNotebookHier>
            <LessonPlanTimeTable classdates = {classdates} 
                                 selDayOnChange = {classdatesSelDayOnChange}
                                 classdatesAdd = {classdatesAdd} 
                                 classdatesRmv = {classdatesRmv}></LessonPlanTimeTable>
        </div>
    );
};