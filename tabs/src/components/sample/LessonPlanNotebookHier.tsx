import { useContext, useState, useCallback, useEffect } from "react";
import { ILessonPlanNotebookHierProps } from '../../helper/IProps';
import { TeamsFxContext } from "../Context";
import { Dropdown, DropdownProps } from '@fluentui/react-northstar'
import { RadioGroup, Divider } from "@fluentui/react-northstar";
import { INotebookInfo, ISectionGroupInfo, ISectionInfo } from "../../helper/INotes";
// import { getNotebookHier } from "../../helper/NotebookHier";
import { useGraph } from "@microsoft/teamsfx-react";
import { TeamsFx } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import { createMicrosoftGraphClient } from "@microsoft/teamsfx";
import { Providers, ProviderState } from '@microsoft/mgt-element';
import { TeamsFxProvider } from '@microsoft/mgt-teamsfx-provider';
import { Button } from "@fluentui/react-northstar";

function getSectionHierarchyItems() {
  return [
    {
      name: 'sectionHierarchy',
      key: 'underNotebooks',
      label:'unter einem Notizbuch',
      value: 'underNotebooks',
    },
    {
      name: 'sectionHierarchy',
      key: 'underSectionGroups',
      label:'unter einer Abschnittsgruppe',
      value: 'underSectionGroup',
    },
  ]
}

function getDefaultSecHierarchy(secUnderSec: boolean) : string {
  if (secUnderSec) {
    return 'underSectionGroup'
  } else {
    return 'underNotebooks'
  }
}

// export function LessonPlanNotebookHier(props: { selSectionID: string;
//                                                 selSectionIDOnChange: (value: string) => void;
//                                                 selSectionGroupID: string;
//                                                 selSectionGroupIDOnChange: (value: string) => void;
//                                                 selNotebookID: string;
//                                                 selNotebookIDOnChange: (value: string) => void }) {
  // export function LessonPlanNotebookHier(props: {}) {
export function LessonPlanNotebookHier(props: ILessonPlanNotebookHierProps) {
  const { teamsfx } = useContext(TeamsFxContext);

  const emptyINotebookInfoArr : INotebookInfo[] = [];
  const emptyISectionGroupInfoArr : ISectionGroupInfo[] = [];
  const emptyISectionInfoArr: ISectionInfo[] = [];
  // const [notebookState, setNotebookState] = useState({
  //   notebooks: emptyINotebookInfoArr,
  //   selNotebookID: ''
  // });
  // const [sectionGroupState, setSectionGroupState] = useState({
  //   sectionGroups: emptyISectionGroupInfoArr,
  //   selSectionGroupID: ''
  // });
  // const [sectionState, setSectionState] = useState({
  //   sections: emptyISectionInfoArr,
  //   selSectionID: ''
  // });
  const [notebookState, setNotebookState] = useState(emptyINotebookInfoArr);
  const [sectionGroupState, setSectionGroupState] = useState(emptyISectionGroupInfoArr);
  const [sectionState, setSectionState] = useState(emptyISectionInfoArr);
  const [secUnderSecState, setSecUnderSecState] = useState(false);
  const [statusState, setStatusState] = useState({
    error: false,
    errorMsg: ''
  });

  const scope = ["User.Read", "Notes.ReadWrite.All", "Notes.Create"];


  const onCheckedUseSectionGroups = useCallback( (e: any, props: any) => {
    const secUnderSecStr : string | number | undefined = props.value;
    setSecUnderSecState(secUnderSecStr === 'underSectionGroup');
    }, [] 
  );

  useEffect(() => {
    async function getNotebooks() {
      if (teamsfx) {
        // await teamsfx.login(scope);
        const graph = createMicrosoftGraphClient(teamsfx, scope);
        const notebooksRes = await graph.api("/me/onenote/notebooks").get();
        const notebooksArr: INotebookInfo[] = notebooksRes.value;
        const selNotebookID = ''; // maybe later that could be read from a cookie or local storage
        const selNotebook = getSelectedNotebook(notebooksArr, selNotebookID);        
        setNotebookState( (prevState) => ([...notebooksArr]) );
        props.selNotebookIDOnChange(selNotebook?.id || '');
      }
    };
    getNotebooks();
  }, []);

  useEffect(() => {
    async function getSectionGroups() {
      if (teamsfx) {
        // await teamsfx.login(scope);
        const graph = createMicrosoftGraphClient(teamsfx, scope);
        const sectionGroupRes = await graph.api("/me/onenote/sectionsGroups/" + props.selNotebookID + "/sectionGroups").get();
        const sectionGroupArr: ISectionGroupInfo[] = sectionGroupRes.value;
        const selSectionGroupID: string = ''; // Change !!! Change !!! Change !!! Change !!! Change !!! Change !!!
        setSectionGroupState((prevState) => ([...sectionGroupArr]));
      }
    };
    getSectionGroups();
  }, [props.selNotebookID]);

  useEffect(() => {
    async function getSections() {
      if (teamsfx) {
        const graph = createMicrosoftGraphClient(teamsfx, scope);

        const parentSection = getSectionParent(notebookState, props.selNotebookID, sectionGroupState, props.selSectionGroupID);
        if (parentSection) {
          let sectionRes = undefined;
          if (secUnderSecState) {
            sectionRes = await graph.api("/me/onenote/sectionsGroups/" + parentSection.id + "/sections").get();
          } else {
            sectionRes = await graph.api("/me/onenote/notebooks/" + parentSection.id + "/sections").get();
          }
          const sectionArr: ISectionInfo[] = sectionRes.value;
          const selSectionGroupID: string = ''; // Change !!! Change !!! Change !!! Change !!! Change !!! Change !!!
          setSectionState((prevState) => ([...sectionArr]));  
          props.selSectionIDOnChange('');
        };
      };
    };
    getSections();
  }, [props.selNotebookID, props.selSectionGroupID]);


  // const { loading, error, data, reload } = useGraph(
  //   async (graph, teamsfx, scope) => {
  //     try {
  //       // Call graph api directly to get user profile information
  //       const profile = await graph.api("/me").get();

  //       // Initialize Graph Toolkit TeamsFx provider
  //       const provider = new TeamsFxProvider(teamsfx, scope);
  //       Providers.globalProvider = provider;
  //       Providers.globalProvider.setState(ProviderState.SignedIn);

  //       const notebooksRes = await graph.api("/me/onenote/notebooks").get();
  //       const notebooksArr: INotebookInfo[] = notebooksRes.value;
  //       setHierState( (prevState) => ({
  //         ...prevState,
  //         notebooks: [...notebooksArr]
  //       }) );
  //       // get selected notebook
  //       const selNotebook = getSelectedNotebook();
  //       if (selNotebook) {
  //         // get section groups
  //         const sectionGroupRes = await graph.api("/me/onenote/notebooks/" + selNotebook.id + "/sectionGroups").get();
  //         const sectionGroupArr: ISectionGroupInfo[] = sectionGroupRes.value;
  //         setHierState((prevState) => ({...prevState, sectionGroups: [...sectionGroupArr]}));
  //       }
  //     } catch (error) {  
  //       console.log(error);
  //     }      
  //   },
  //   { scope: ["User.Read", "Notes.ReadWrite.All", "Notes.Create"], teamsfx: teamsfx }
  // );

  function getSelectedNotebook(notebookArr: INotebookInfo[], selNotebookID: string) : INotebookInfo | undefined {
    let selNotebook: INotebookInfo | undefined = undefined;
    if (notebookArr.length > 0) {
      if (selNotebookID !== '') {
        selNotebook = notebookArr.find(el => el.id === selNotebookID);
        // if for whatever reason the selected notebook is not present in the notebooks array, get the first one
        if (!selNotebook) {
          selNotebook = notebookArr[0];
        }
      } else {
        selNotebook = notebookArr[0];
      }
    }
    return selNotebook;
  };

  function getSectionParent(notebookArr: INotebookInfo[], selNotebookID: string, sectionGroupArr: ISectionGroupInfo[], selSectionGroupID: string, ) : INotebookInfo | ISectionGroupInfo | undefined {
    let sectionParent : INotebookInfo | ISectionGroupInfo | undefined = undefined;
    if (secUnderSecState && sectionGroupArr.length > 0) {
      if (selSectionGroupID !== '') {
        sectionParent = sectionGroupArr.find(el => el.id === selSectionGroupID);
        if (!sectionParent) {
          sectionParent = sectionGroupArr[0];
        } 
      } else {
        sectionParent = sectionGroupState[0];
        // sectionParent = sectionGroupState.sectionGroups[0];
      }
    } else {
      sectionParent = getSelectedNotebook(notebookArr, selNotebookID);
    }
    return sectionParent;
  }

  async function onNotebookChange(event: any, data: DropdownProps) {
    const val : any = data.value;
    if (val && (val.id !== props.selNotebookID)) {
      console.log('the newly selected notebook is = ' + val.header);
      props.selNotebookIDOnChange(val.id);
      // setNotebookState( (prevState) => ({...prevState, selNotebookID: val.id}) );
      // this.props.selNotebookIDOnChange(val.id);
      // // setState is async => await it
      // // await this.setState({selNotebookID: val.id});
      // // the root notebook changed => the dropdowns for section groups and sections need to be refilled
      // this.getSectionGroups(val.id);
      // const sectionsParentID = this.getSectionParent()?.id;
      // if (!this.state.error && sectionsParentID) {
      //   this.getSections(sectionsParentID)
      // }  
    }
  }
  function onSectionGroupChange(event: any, data: DropdownProps) {
    const val : any = data.value;
    if (val && (val.id !== props.selSectionGroupID)) {
      console.log('the newly selected section group is = ' + val.header);
      props.selSectionGroupIDOnChange(val.id);
      // this.setState({selSectionGroupID: val.id});
      // the root section group changed => the dropdwons for sections need to be refilled
      // this.getSections(this.props.selSectionGroupID);
    }
  }

  async function onSectionChange(event: any, data: DropdownProps) {
    const val : any = data.value;
    if (val && (val.id !== props.selSectionID)) {
      console.log('the newly selected section is = ' + val.header);
      props.selSectionIDOnChange(val.id);
      // setSectionState( (prevState) => ({...prevState, selSectionID: val.id}) );
    }
  };

  // function getSelectedNotebook() : INotebookInfo | undefined {
  //   let selNotebook: INotebookInfo | undefined = undefined;
  //   if (hierState.notebooks.length > 0) {
  //     if (props.selNotebookID !== '') {
  //       selNotebook = hierState.notebooks.find(el => el.id === props.selNotebookID);
  //       // if for whatever reason the selected notebook is not present in the notebooks array, get the first one
  //       if (!selNotebook) {
  //         selNotebook = hierState.notebooks[0];
  //         props.selNotebookIDOnChange(selNotebook.id);
  //       }
  //     } else {
  //       selNotebook = hierState.notebooks[0];
  //       props.selNotebookIDOnChange(selNotebook.id);
  //     }
  //   }
  //   return selNotebook;
  // }

  return (
    <div>
      <h1>Abschnitt auswählen</h1>
      <div>
        Der Abschnitt befindet sich 
        <RadioGroup
          vertical
          items={getSectionHierarchyItems()} 
          onCheckedValueChange={onCheckedUseSectionGroups}
          defaultCheckedValue={getDefaultSecHierarchy(secUnderSecState)}
        />
      </div>
      <Divider></Divider>
      <h3>Notebooks</h3>
      <Dropdown
        search
        items={notebookState.map((el: INotebookInfo) => { return {'header': el.displayName, 'id': el.id} })}
        // items={this.state.notebooks.map(el => el.displayName)}
        placeholder="Start typing a name of a notebook"
        noResultsMessage="We couldn't find any matches."
        getA11ySelectionMessage={{
          onAdd: item => `${item} has been selected.`,
          // onAdd: this.a11Notebooks,//item => `${item} has been selected.`,
        }}
        onChange={onNotebookChange}
      />
      <Divider></Divider>
      <h3>Section Groups</h3>
        <Dropdown
          search
          // items={this.state.notebooks}
          items={sectionGroupState.map(el => el.displayName)}
          placeholder="Start typing a name of a notebook"
          noResultsMessage="We couldn't find any matches."
          getA11ySelectionMessage={{
            onAdd: item => `${item} has been selected.`,
            // onAdd: this.a11Notebooks,//item => `${item} has been selected.`,
          }}
          // onActiveSelectedIndexChange={this.onNotebookSelChange}
          disabled={!secUnderSecState}
          onChange={onSectionGroupChange}
        />
        <h3>Sections</h3>
        <Dropdown
          search
          value={sectionState.find(el => (el.id === props.selSectionID)) }
          // items={this.state.notebooks}
          items={sectionState.map(el => { return {'header': el.displayName, 'id': el.id} } )}
          placeholder="Start typing a name of a notebook"
          noResultsMessage="We couldn't find any matches."
          getA11ySelectionMessage={{
            onAdd: item => `${item} has been selected.`,
            // onAdd: this.a11Notebooks,//item => `${item} has been selected.`,
          }}
          onChange={onSectionChange}
        />


      {/* <Button primary content="Authorize" disabled={loading} onClick={reload} /> */}

    </div>
  );
}