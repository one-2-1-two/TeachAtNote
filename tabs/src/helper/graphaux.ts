// import { TeamsFxContext } from "../components/Context";
import { TeamsFx } from "@microsoft/teamsfx";
import { createMicrosoftGraphClient } from "@microsoft/teamsfx";
import { IPageInBatch } from "./INotes";

export async function getPageCount(teamsfx: TeamsFx, sectionID: string) {
    const scope = ["User.Read", "Notes.ReadWrite.All", "Notes.Create"];

    const graph = createMicrosoftGraphClient(teamsfx, scope);

    let pageCount: number = -1;
    let status: number = 500; // bad request
    let failReason: string = '';

    try {
        const pages = await graph.api("https://graph.microsoft.com/v1.0/me/onenote/sections/" + sectionID + "/pages?$count=true").get();
        if (pages) {
            pageCount = pages.value['@odata.count'];
            status = 200;
        } else {
            failReason = pages.toString()
        }            
    } catch (error: unknown) {
        if (graph.is error) {
            failReason = 'Unexpected exception while requesting the notebook page coung from MS graph: ' + error.message; 
        }
    }
    return {
        count: pageCount,
        status: status,
        failReason: failReason
    };
};

export async function batchCreatePages(  teamsfx: TeamsFx,
                                         pages: IPageInBatch[] ) {
    const scope = ["User.Read", "Notes.ReadWrite.All", "Notes.Create"];

    const graph = createMicrosoftGraphClient(teamsfx, scope);
    const batchJSON = {
        requests: pages
    };
    // let graphBatchEndpoint = "https://graph.microsoft.com/v1.0/$batch";
    // let graphRequestParams = {
    //     method: 'POST',
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json",
    //         "authorization": "bearer " + graphAccessToken
    //     },
    //     body: JSON.stringify(batchJSON)
    // };
    const body : string = JSON.stringify(batchJSON);
    const newPages = await graph.api('https://graph.microsoft.com/v1.0/$batch').post(body);

    // let response = await fetch(graphBatchEndpoint, graphRequestParams).catch(unhandledFetchError);
    // if (response) {
    // if (!response.ok) {
    // const newPage = await response.json();
    // console.log(newPage);
    // // const id = newPage["id"];
    // // console.log(id);
    // } else {
    // console.log('batch request response status');
    // console.log(response.status);
    // console.log(response.statusText);
    // }
    // } else {
    // console.log("batch request => no response");
    // }
}
