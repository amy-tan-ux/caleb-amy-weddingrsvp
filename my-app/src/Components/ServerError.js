import "./style/DetailsDisplay.css";
const ServerError = () => {
    return (
        <div className="wedding-container">
          <h1 className="rose-gold-title">Server Error Encountered</h1>
          <p className="story-text">
            Thank you for taking your time to RSVP to our wedding. Unfortunately our servers are currently down. Please try again later. 
          </p>
        </div>
      );
};


export default ServerError;