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
  const [guestCode, setGuestCode] = useState("Please Enter Your Guest Code To RSVP");
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
                setGuestCode("Enter Your Guest Code or Check Your Site URL");
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

    <div>
       {authenticationStatus && (<navigationBar class="navbar">
        <a href="#details">Wedding Details</a>
        <a href="#rsvp">RSVP Details</a>
        <a href="#story">Our Love Story</a>
      </navigationBar>)}
      {!onlineStatus && (<ServerError></ServerError>)}
      {/* Initial Loading View */}
        <div className={`hero ${isInitLoading ? 'fly-in' : ''}`} >
          <div className='hero-content '>
            <div className='invite-hero2'>You Are Invited</div>
            <div className="invite-hero1">to celebrate the wedding of</div>
            <div className='invite-hero4'>Caleb & Amy</div>
            <div className="invite-hero1">Thank you for being part of <br/>our Story!</div>
        {!isInitLoading && !authenticationStatus && (<form onSubmit={getRSVPDetails}>
          <input
            type="text"
            name="guestCode" 
            placeholder={guestCode}
            onChange={(e) => setGuestCode(e.target.value)}
            required
            className="input-box"
          />
        </form>
      )}
      </div>
      </div>
      <div>
        {/* No Guest Code View */}
        { !isInitLoading &&
        (
        <>
        <EventsDetailsPage></EventsDetailsPage>
        {/* Guest Code Form View */}
        {authenticationStatus && (
          <>
          {/* Guest Code Details View */}
          <div className='section-header' id="details">Event Schedule & Details</div>
          {authorizedDetails.map((content) => (
            <EventsDetailsPagePrivate title={content["title"]} 
                  location={content["location"]} 
                  schedule={content["schedule"]}
                  note={content["note"]} 
                  locationlink={content["locationlink"]}  />))}
                  <br/><br/><br/><br/><br/>
                  </>)}
      
      {showOnlineContent && (<SongRequestsMessages userCode={guestCode} userName={guestName} pastSuggestedSong={musicRequestList} messageToCouples={coupleMessagesList} />)}   
         
         {authenticationStatus && (
          <>
          {/* RSVP Form */}
          <RsvpFormP FormValues={authorizedFormComponents} GuestName={guestName} RsvpStatus={rsvpStatus} GuestCode={guestCode} RelatedGuestCode={relatedGuest.GuestCode} RelatedGuestName={relatedGuest.GuestName}/>
          </>)}
        <OurLoveStory></OurLoveStory>
        </>
        )}
      </div>
    </div>
  );
}

export default App;
