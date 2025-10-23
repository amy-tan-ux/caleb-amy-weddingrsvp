import './App.css';
import {useEffect, useState} from "react";
import {getDetailsByGuestCode, getMessageToCouple, getMusicRequests} from './Scripts/googleDataInterface';

// Public
import OurLoveStory from './Components/OurLoveStory';
import SongRequestsMessages from './Components/SongRequestsMessages';
import EventsDetailsPage from './Components/EventsDetailsPage';
import ServerError from './Components/ServerError';
// Private
import RsvpFormP from './Components/RsvpFormP';
import EventsDetailsPagePrivate from './Components/EventsDetailsPageP';


function App() {
  const [isInitLoading, setIsInitLLoading] = useState(true);
  // No GuestCode Parameter Form View
  const [onlineStatus, setOnlineStatus] = useState(true); // server down view
  const [showOnlineContent, setShowOnlineContent] = useState(false);
  const [authenticationStatus, setAuthenticationStatus] = useState(false); // unauthorized view
  const [rsvpStatus, setRsvpStatus] = useState(false);
  const [guestCode, setGuestCode] = useState("Please Enter Your Guest Code");
  const [guestName, setGuestName] = useState("");

  // Form Components Avalible to User to Access
  const [authorizedFormComponents, setAuthorizedFormComponents] = useState([]);
  // RSVP Details Components Avalible to User to Access
  const [authorizedDetails, setAuthorizedDetails] = useState([]);
  // RSVP Related Guests
  const [relatedGuest, setRelatedGuest] = useState({});
  // Music Requests
  const [musicRequestList, setMusicRequestList] = useState([]);
  // Message to Couple
  const [coupleMessagesList, setCoupleMessagesList] = useState([]);

  // Check Access
  const fetchAuthDetails = async (accessCode = "") => {
      setIsInitLLoading(true); //loading
      try {// get music list
        const response = await getDetailsByGuestCode(accessCode);
        console.log("accessDetails:", response);
        if (response.status === 'Success') {
          console.log("Successfully authenticated for ", response.guestName,response.eventDetails, response.formFields);
          if (response.eventDetails && response.formFields){
                // check status of retrieving authorized data and details
                setAuthorizedDetails(response.eventDetails);
                setAuthorizedFormComponents(response.formFields);
                if (response.guestName){
                  setGuestName(response.guestName);}
                if (response.hasRSVPHistory){
                  setRsvpStatus(response.hasRSVPHistory);}
                if (response.relatedGuest){
                  setRelatedGuest({"GuestName":response.relatedGuest, "GuestCode":response.relatedGuestCode});
                }
                // show authorized content
                setAuthenticationStatus(true);
                console.log("set events and forms:", response.eventDetails, response.formFields);
          }
        } else if (response.status === 'Unauthorized'){
                setAuthenticationStatus(false);
                console.log(`Guest Code ${guestCode} is unauthorized to access content`); 
                setGuestCode("Check Your Site URL or Guest Code and Try Again.");
        } else {
          console.error('Failed to load authorization details:', response);
          setAuthenticationStatus(false);
        }
      } catch (error) {
        console.error('Error fetching authorization details:', error);
        setAuthenticationStatus(false);
      }finally{
        setIsInitLLoading(false); // end loading
      }
    };

  useEffect(() => {

    // get/set guestCode
    const params = new URLSearchParams(window.location.search); // Check for parameters
    const paramsGuestCode = params.get('guestCode'); // Retrieve guestCode parameter if there is one

    if (paramsGuestCode) {
      setGuestCode(paramsGuestCode);
      console.log(paramsGuestCode);

      // check access, get details and RSVP
      fetchAuthDetails(paramsGuestCode);

    } else{ // Fail: show default
      setIsInitLLoading(false);
    }

    // get and set song and messages
    const fetchMusicMessage = async () => {
      console.log("fetching async music and message")
      try {// get music list
        const response = await getMusicRequests();
        console.log("music request results");
        console.log(response);
        if (response.status === 'Success') {
          console.log("Successful");
          setMusicRequestList(response.suggestedSongs);
          setOnlineStatus(true);
          try {// get message list
              const response = await getMessageToCouple();
              console.log("message list results");
              console.log(response);
              if (response.status === 'Success') {
                console.log("Successful");
                let messageArray = [];
                if (Array.isArray(response.messagetocouple) && response.messagetocouple.length > 0) {
                        for (const msg of response.messagetocouple) {
                          if (msg.message && msg.name){
                            messageArray.push(msg.message + "- " + msg.name);
                          }
                          else if (msg.message){
                            messageArray.push(msg.message)
                          }

                        }
                    
                    setCoupleMessagesList(messageArray);
                    }
                  setShowOnlineContent(true);
                } else {
                  console.error('Failed to load messages:', response);
                  setOnlineStatus(false);
                }
              } catch (error) {
                console.error('Error fetching messages:', error);
                setOnlineStatus(false);
              }
        } else {
          console.error('Failed to load music requests:', response);
          setOnlineStatus(false);
        }
      } catch (error) {
        console.error('Error fetching music requests:', error);
        setOnlineStatus(false);
      }
    };
    fetchMusicMessage();

    
  }, []);
 
  const getRSVPDetails = async (e) => {
    e.preventDefault();
    // check access, get details and RSVP
    fetchAuthDetails(guestCode);
  }

  return (

    <div className="parallax">

      {/* No Guest Code View */}
      {showOnlineContent && (<SongRequestsMessages userCode={guestCode} userName={guestName} pastSuggestedSong={musicRequestList} messageToCouples={coupleMessagesList} />)}
      <div className="container">
      <div className="profile-container">
      </div>
        {!onlineStatus && (<ServerError></ServerError>)}
        <div className={`${isInitLoading ? 'fly-in' : ''}`} >
          <div className="circle-image"></div>
          <h1 className="wedding-title">Caleb & Amy</h1>
          <p className="subtext">Join us for our special day!</p>
        </div>

        {!isInitLoading && !authenticationStatus && (<form onSubmit={getRSVPDetails}>
          <input
            type="text"
            name="guestCode" 
            placeholder={guestCode}
            onChange={(e) => setGuestCode(e.target.value)}
            required
            className="input-box"
          />
          <br />
          <button type="submit" className="btn">RSVP</button>
        </form>
      )}

        {/* Guest Code Form View */}
        {authenticationStatus && (
          <>
          <RsvpFormP FormValues={authorizedFormComponents} GuestName={guestName} RsvpStatus={rsvpStatus} GuestCode={guestCode}/>
          {relatedGuest.GuestName && <> <br/> <br/> <br/>  
            <a href={`${window.location.origin}/?guestCode=${relatedGuest.GuestCode}`} target="_blank" rel="noopener noreferrer">
            RSVP for {relatedGuest.GuestName}
            </a></>}
          {/* Guest Code Details View */}
          {authorizedDetails.map((content) => (
            <EventsDetailsPagePrivate title={content["title"]} 
                  location={content["location"]} 
                  schedule={content["schedule"]}
                  note={content["note"]} 
                  locationlink={content["locationlink"]}  />))}
          </>)}

        {/* No Guest Code View */}
        { !isInitLoading &&
        (
        <>
        <EventsDetailsPage></EventsDetailsPage>
        <OurLoveStory></OurLoveStory>
        <footer>
          Caleb & Amy 2025 <br/>
          Wedding RSVP Website
        </footer>
        </>
        )}
      </div>
    </div>
  );
}

export default App;
