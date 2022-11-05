import { useContext, useState, useCallback, useEffect } from "react";
import { TeamsFxContext } from "../Context";
import { ILessonPlanCreatorProps } from "../../helper/IProps";
import { IClassdate, ISemester, IClassdateEvent, IPageInBatch } from "../../helper/INotes";
import { getSemester, makeClassdates, classdatesToPages } from "../../helper/scheduler";
import { getPageCount, batchCreatePages } from "../../helper/graphaux";

export function LessonPlanCreator(props: ILessonPlanCreatorProps) {
  const { teamsfx } = useContext(TeamsFxContext);

  const emptyClassdatesArr : IClassdate[] = [];
  const [classdatesState, setClassdatesState] = useState(emptyClassdatesArr);
  const [batchProcessStatusState, setBatchProcessStatusState] = useState('0/0');
  const [pagesProcessStatusState, setPagesProcessStatusState] = useState('0/0');
  const [loaderHiddenState, setLoaderHiddenState] = useState(true);
  const [statusState, setStatusState] = useState({status: 'test', statusHidden: true, ctr: 0});

  async function onClickCreateLessonPlan(e: any) {
    if (teamsfx) {  
      // get the semester object
      const semester : ISemester = getSemester(props.year, props.holidays);
    
      const classdates: IClassdateEvent[] = makeClassdates(semester, props.holidays, props.classdates);
      const pageBatches: IPageInBatch[][] = classdatesToPages(classdates, props.sectionID);
      const nBatches = pageBatches.length;
      const nPages = classdates.length;
    
      console.log('n batches: ', nBatches.toString());
      let pagesCreated = 0;
      const pagesProcessStatusStr: string = pagesCreated.toString() + '/' + nPages.toString();
      setPagesProcessStatusState(pagesProcessStatusStr);
    
      let batchCtr = 1;
      setLoaderHiddenState(false);
      for (const pages of pageBatches) {
        console.log('batch page count', pages.length.toString());
    
        // get page count prior to batch job
        const pageCountPre = await getPageCount(teamsfx, props.sectionID);
        // update state: batch process status
        const batchProcessStatusStr: string = batchCtr.toString() + '/' + nBatches.toString();
        setBatchProcessStatusState(batchProcessStatusStr);
        // create a batch
        await batchCreatePages(teamsfx, pages);
        // wait for 2s
        await new Promise(r => setTimeout(r, 2000));
        let retryCount = 0;
        // now check if all pages were added
        let pageCountPost = await getPageCount(teamsfx, props.sectionID);
        // update state: pages created
        pagesCreated = pageCountPost.count - pageCountPre.count + (batchCtr - 1)*20;
        const pagesProcessStatusStr: string = pagesCreated.toString() + '/' + nPages.toString();
        setPagesProcessStatusState(pagesProcessStatusStr);
  
        // loop until all pages are added to the notebook section
        while ( (pageCountPost.count < pageCountPre.count + pages.length) && (retryCount < 10) ) {
          await new Promise(r => setTimeout(r, 2000));
          pageCountPost = await getPageCount(teamsfx, props.sectionID);
  
          pagesCreated = pageCountPost.count - pageCountPre.count + (batchCtr - 1)*20;
          const pagesProcessStatusStr: string = pagesCreated.toString() + '/' + nPages.toString();
          setPagesProcessStatusState(pagesProcessStatusStr);
              
          retryCount += 1;
        }
        batchCtr += 1;
      };
      setLoaderHiddenState(true);
  
    }
  };
};