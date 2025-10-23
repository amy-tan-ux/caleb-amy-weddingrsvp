import { useEffect, useState } from "react";
import { FaMusic, FaEnvelope, FaTimes, FaPaperPlane } from "react-icons/fa";
import "./style/SongRequestsMessages.css"; // Add CSS for styling
import DynamicSVGMessages from "./DynamicSVGMessage";
import { postMessageToCouple, postSongRequests } from "../Scripts/googleDataInterface";

const SongRequestsMessages = ({userCode = "open", userName = "anonymous", pastSuggestedSong = [], messageToCouples = []}) => {
  // Side bar that takes Song Requests and Message to Couple
    console.log("songrequest page with songs and messages:", pastSuggestedSong, messageToCouples);
    const [isOpen, setIsOpen] = useState(false);
    const [songRequest, setSongRequest] = useState("");
    const [messageToCouple, setMessageToCouple] = useState("");
    const [guestName, setGuestName] = useState("");
    const [inputSongValue, setInputSongValue] = useState("");
    const [inputMessageValue, setInputMessageValue] = useState("");
    const [freezeSongInput, setFreezeSongInput] = useState(false);
    const [freezeMessageInput, setFreezeMessageInput] = useState(false);

    const [showMessages, setShowMessages] = useState(false);
    useEffect(() => {
      if (messageToCouples.length>=3){
        setShowMessages(true);
      }})

    // save song requests
    const saveSongRequests = async (e) => {
          e.preventDefault();
          try {
            if (!songRequest| songRequest == "Fail00" | songRequest == "Success00"){
              return;
            }
            setFreezeSongInput(true);
            const response = await postSongRequests(userCode, guestName? guestName : userName, [songRequest]);
            // Success Message
            setSongRequest("Success00")
            setTimeout(() => setSongRequest(""), 3000); // Hide message after 3 seconds
          } catch (error) {
            console.error('Submission error:', error);
            // Failiure Message
            setSongRequest("Fail00");
            setTimeout(() => setSongRequest(""), 5000); // Hide message after 5 seconds
          }finally{
            setInputSongValue("");
            setFreezeSongInput(false);
          }
      };

    // save messages 
    const saveMessages = async (e) => {
          e.preventDefault();
          try {
            if (!messageToCouple| messageToCouple == "Fail00" | messageToCouple == "Success00"){
              return;
            }
            setFreezeMessageInput(true);
            const response = await postMessageToCouple(userCode, guestName? guestName : userName, [messageToCouple]);
            // Success Message
            setMessageToCouple("Success00")
            setTimeout(() => setMessageToCouple(""), 3000); // Hide message after 3 seconds
          } catch (error) {
            console.error('Submission error:', error);
            // Failiure Message
            setMessageToCouple("Fail00");
            setTimeout(() => setMessageToCouple(""), 5000); // Hide message after 5 seconds
          }finally{
            setInputMessageValue("");
            setFreezeMessageInput(false);
          }
      };

      // TODO: Creaet new entries to add messages and song requests

    return (
      <div className="side-panel-container">
        
        {/* Sliding Panel */}
        <div
          className={`side-panel ${isOpen ? "open" : ""}`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
              <div className="icon-container">
                <FaMusic className="icon" />
                <FaEnvelope className="icon" />
              </div>
        <div className = {`form-panel ${isOpen ? "open" : ""}`}>
            {/* Close Button */}
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FaTimes className="close-btn-icon" />
            </button>
          <br/> <br/> 
          {userName && <>Hi {userName}, you can leave us a message or request a song here! We really appreciate all messages and song suggestions you are about to share.</>}
          <form>
          {( !userName || userName==="anonymous" || userName==="Please Enter Your Guest Code") && <> We really appreciate all messages and song suggestions you are about to share. We kindly ask you to share your name so we know who you are!<br/> <br/>
          <input type="text" placeholder="Enter Your Name" className="input-box-side"  onChange={(e) => setGuestName(e.target.value)}/> <br />
          </> }
          <h3>Suggest a Song or Leave Us a Message</h3>
          <br/>

          {/* Song Request Input with Send Button */}
          <div className="input-container">
            <input
              type="text"
              value={inputSongValue}
              placeholder="Song Request"
              className="input-box-side"
              onChange={(e) => {setSongRequest(e.target.value); setInputSongValue(e.target.value)}}
              readOnly={freezeSongInput}
              style={{backgroundColor: freezeSongInput ? "#c1c1c1ff" : "white"}}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveSongRequests(e);
                }}}
              
            />
            <button type="button" className="icon-btn" onClick={saveSongRequests}>
              <FaPaperPlane />
            </button>
          </div>
          {(songRequest === "Success00") && <p className="success-message">Successfully Submited Your Song Request.</p>}
          {(songRequest === "Fail00") && <p className="fail-message">Failed to Submit Your Song Request. Please Try Again Later.</p>}
          <br/>
          {/* Message Input with Send Button */}
          <div className="input-container">
            <input
              type="text"
              value={inputMessageValue}
              placeholder="Message to Us"
              className="input-box-side"
              onChange={(e) => {setMessageToCouple(e.target.value); setInputMessageValue(e.target.value)}}
              readOnly={freezeMessageInput}
              style={{backgroundColor: freezeMessageInput ? "#c1c1c1ff" : "white"}}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveMessages(e);
                }}}
            />
            <button type="button" className="icon-btn" onClick={saveMessages}>
              <FaPaperPlane />
            </button>
          </div>
          {(messageToCouple === "Success00") && <p className="success-message">Successfully Submited Your Message.</p>}
          {(messageToCouple === "Fail00") && <p className="fail-message">Failed to Submit Your Message. Please Try Again Later.</p>}
        </form>
        </div>
        {showMessages && < DynamicSVGMessages messagesList={messageToCouples} />}
        </div>
      </div>
    );
  };
export default SongRequestsMessages;
