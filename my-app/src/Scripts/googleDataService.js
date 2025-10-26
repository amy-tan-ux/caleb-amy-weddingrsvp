export const callGoogleScriptsService = async (httptype, guestCode, action, payload) => {
/*
 httptype: string (POST or GET)
 guestCode: string (Guest Unique Access Code)
 action: endpoint action
    - POST:
        - rsvp
        - music-requests
        - message-to-couple
    - GET:
        - access
        - music-requests
        - message-to-couple
 payload: the payload json for the endpoint

*/
    // Wedding Details Spreadsheet Google Web App URL
    const guestDetailsUrl = process.env.REACT_APP_GOOGLE_SHEETS_WEBAPP;  
    console.log(guestDetailsUrl);
    const urlExtension = `?guestCode=${guestCode}&actions=${action}`;
    debugger
    if (httptype === "POST"){
            try {
                let googleScriptResponse;
                let responseData;
                googleScriptResponse = await fetch(guestDetailsUrl + urlExtension, {
                                                method: "post",
                                                mode: "no-cors", 
                                                headers: {
                                                    "Accept": "application/json",
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify(payload)
                                                })
                if (!googleScriptResponse.ok) {
                    throw new Error(`HTTP Error: ${googleScriptResponse.status}`);
                }

                responseData = await googleScriptResponse.json();
                console.log(responseData)
                return responseData

            } catch (error) {
            console.error("Error calling Google Apps Script:", error);
                return { "status": "Error"};
            }
        }
    else if (httptype === "GET"){
            try {
                let googleScriptResponse;
                let responseData;
                googleScriptResponse = await fetch(guestDetailsUrl + urlExtension, {
                                                    method: "GET",
                                                    mode: "cors"
                                                })

                if (!googleScriptResponse.ok) {
                    throw new Error(`HTTP Error: ${googleScriptResponse.status}`);
                }

                responseData = await googleScriptResponse.json();
                console.log(responseData)
                return responseData

            } catch (error) {
                console.error("Error calling Google Apps Script:", error);
                return {"status": "Error"};
            }
    }
    else{
        return {"status":"Error"};
    }
};

