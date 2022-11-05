import { useState } from 'react';
import { ILessonPlanTimeTableProps } from '../../helper/IProps';
import { IClassdate } from '../../helper/INotes';
import { Dropdown, Button,/*, DropdownProps, DropdownState*/ TrashCanIcon } from '@fluentui/react-northstar';
import { v1 as uuidv1 } from 'uuid';

import "./LessonPlanTimeTable.css";

const schooldays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export function LessonPlanTimeTable(props: ILessonPlanTimeTableProps) {
    const { classdates, selDayOnChange, classdatesAdd, classdatesRmv } = props;

    const [] = useState();

    function getClassdates() {
        // return  <div className="LessonPicker-Dropdowns">
        //             <button>jflkdsjfkjl</button>
        //             <button>hfkjdshflkk</button>
        //         </div>
        // const styleObj = { width: "20px" };
        // const dropdownStyles: ComponentSlotStyle<DropdownProps, DropdownState> = {
        //     width: "300px",
        //   };
        console.log('updating');
        return classdates.map( (el, ix) => 
            <div className="LessonPicker-Dropdowns" key={el.id}>
                <Dropdown
                    className="short.fq LessonPicker-Dropdown-Box"
                    // style={{width: "12.25rem"}}
                    // styles={{width: "12.25rem"}}
                    // checkable
                    items={schooldays}
                    // placeholder="Start typing a class day "
                    // noResultsMessage="We couldn't find any matches."
                    getA11ySelectionMessage={{
                    onAdd: item => `${item} has been selected.`,
                    }}
                    value={el.day}
                    onChange={(event, data) => {onChangeSelDay(event, data, ix) }}
                    />
                <Dropdown
                    className="LessonPicker-Dropdown-Box"
                    items={["1", "2", "3", "4"]}
                    placeholder="Start typing a number of lessons"
                    noResultsMessage="We couldn't find any matches."
                    getA11ySelectionMessage={{
                    onAdd: item => `${item} has been selected.`,
                    }}
                    value={'1'}
                    highlightedIndex={0}
                />
                <Button
                    className="LessonPicker-Dropdown-Box"
                    icon={<TrashCanIcon />} 
                    text iconOnly
                    title="Remove lesson"
                    onClick={(e) => { onClickDel(e, ix) }}
                />
            </div>
        )
    }

    function onChangeSelDay(event: any, data: any, ix: number) {
        // console.log(data.value);
        selDayOnChange(ix, data.value);
        // let classdates = this.props.classdates;
        // classdates[ix].day = data.value;
        // this.setState({classdates: classdates});
    }

    // event arg is SyntheticBaseEvent
    function onClickAdd(e: any) {
        // console.log(e)
        let newLesson: IClassdate = { day: 'Montag', 
                                      number: '1', 
                                      weekSchedule: {pattern: [1], startNo: 1}, 
                                      time: new Date(Date.parse('2021-01-01T08:30:00')),
                                      id: uuidv1() };
        classdatesAdd(newLesson);
        // let oldLessonSchedule: ILessonSchedule = this.state;//.classdates;
        // this.setState({ classdates: oldLessonSchedule.classdates.concat(newLesson) });
    }

    function onClickDel(e: any, ix: number) {
        classdatesRmv(classdates[ix].id);
        // let oldLessonSchedule: ILessonPickerProps = this.state;
        // oldLessonSchedule.classdates.splice(ix, 1);
        // this.setState({ classdates: oldLessonSchedule.classdates });
    }

    return (
        <div>
        <h1>Unterrichtsstunden festlegen</h1>
        { getClassdates() }
        <div className="LessonPicker-Dropdowns">
            <Button
                    // circular
                    className="LessonPicker-Dropdown-Box"
                    // icon={<AddIcon />}
                    title="Add lesson"
                    onClick={onClickAdd}
            >
                Termin hinzufügen
            </Button>
            <Button
                    // circular
                    className="LessonPicker-Dropdown-Box"
                    // icon={<AddIcon />}
                    title="Remove all lessons"
                    // onClick={this.onClickAdd}
            >
                Alle Termine entfernen
            </Button>
        </div>
        {/* <div className="LessonPicker-Dropdowns">
            <Dropdown
                search
                items={LessonPicker.getSchooldays()}
                placeholder="Start typing the day of the lesson"
                noResultsMessage="We couldn't find any matches."
                getA11ySelectionMessage={{
                onAdd: item => `${item} has been selected.`,
                }}
            />
            <Dropdown
                search
                items={["1", "2", "3", "4"]}
                placeholder="Start typing a number of lessons"
                noResultsMessage="We couldn't find any matches."
                getA11ySelectionMessage={{
                onAdd: item => `${item} has been selected.`,
                }}
            />
        </div> */}
    </div>
    )
}

