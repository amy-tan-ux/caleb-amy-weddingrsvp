import {callGoogleScriptsService} from "./googleDataService.js"

export const postGuestRSVPDetails = async (guestCode, dynamicPayload) => {
    // POST RSVP DETAILS
    /* Dynamic Payload takes in the forms name and value and turns it into a json object:
    {name: value}*/
     try {
            await callGoogleScriptsService("POST", guestCode, "rsvp", dynamicPayload);
            return {status:"success"};
        }   
    catch (error) {
            console.error("Error RSVP Post Call:", error);
            throw new Error(error);
        }
};
    
export const postSongRequests = async ( guestCode, name, suggestedMusicList) => {
    // POST SONG REQUEST
    try {
            await callGoogleScriptsService("POST", guestCode, "music-requests", {"name": name, "songlist": suggestedMusicList});
            return {status:"success"};
        }   
    catch (error) {
            console.error("Error Music-Request Post Call:", error);
            throw new Error(error);
        }  
};

export const postMessageToCouple = async ( guestCode, name, messages) => {
    // POST MESSAGE TO COUPLE
    try {
            await callGoogleScriptsService("POST", guestCode, "message-to-couple", {"name": name, "messagetocouple": messages});
            return {status:"success"};
        }   
    catch (error) {
            console.error("Error Message-To-Couple Post Call:", error);
            throw new Error(error);
        }  
};
      
export const getDetailsByGuestCode = async (guestCode) => {
    /* GET WEDDING DETAILS BY GUEST CODE ACCESS
         { status: string,
         guestName: string,
         formFields: list,
         eventDetails: list,
         hasRSVPHistory: bool}*/
    try {
            const response = await callGoogleScriptsService("GET", guestCode, "access", {});
            return response;
        }   
    catch (error) {
            console.error("Error Guest Details GET Call:", error);
            throw new Error(error);
        }  
};
          
export const getMusicRequests = async () => {
    /* GET PAST MUSIC REQUESTS
         {status: string,
        songs: lists} */
    try {
            const response = await callGoogleScriptsService("GET", "openGuest", "music-requests", {});
            return response;
        }   
    catch (error) {
            console.error("Error Music List GET Call:", error);
            throw new Error(error);
        }  
};
    
export const getMessageToCouple = async () => {
    /* GET MESSAGES TO COUPLE
        {status: string,
        messagetocouple: lists} */
    try {
            const response = callGoogleScriptsService("GET", "openGuest", "message-to-couple",{});
            return response;
        }   
    catch (error) {
            console.error("Error Message List GET Call:", error);
            throw new Error(error);
        } 
};