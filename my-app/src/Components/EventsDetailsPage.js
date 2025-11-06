import "./style/DetailsDisplay.css"; // Optional CSS for styling

const savemusic = async (e) => {
          e.preventDefault();
    }

const EventsDetailsPage = () => {
    return (
        <div>
          <section class="icon-section">

          <rsvp-section class="icon-link">
            <h3>RSVP Form</h3>
            <div className="rsvplink"></div>
            <p>You can submit or update your RSVP details <a href="#rsvp">here</a><br/><br/>Please submit your RSVP before January 31, 2026.<br/><br/></p>
          </rsvp-section>
          <dress-code-section class="icon-link">
            <h3>Dress Code</h3>
            <div className="dresscodelink"></div>
            <p>Semi-formal <br/><br/> Wear any colour you want!</p><br/><br/>
          </dress-code-section>
          <colour-scheme-section class="icon-link optional">
            <h3>Colour Scheme</h3>
            <div className="schemelink"></div>
            <p>Our decoration colours will be White, Dusty Blue and Navy Blue. Feel free to match the colour scheme if you want!</p>
          </colour-scheme-section>
          <gift-section class="icon-link">
            <h3>Gifts & Registry</h3>
           <div className="giftlink"></div>
            <p>Your presence and attendance is already appreciated but if you do wish to give us something we will accept a <a href="https://en.wikipedia.org/wiki/Red_envelope">lucky red pocket</a> as a symbol of good luck in our Chinese culture!</p>
          </gift-section>
          <song-request-section class="icon-link optional">
            <h3>Song Requests</h3>
           <div className="requestslink"></div>
            <p>You can submit a song request or send us a message <a href="#music-message">here</a> <br/> <br/> Any genre of music is welcome!!<br/><br/></p>
          </song-request-section>
        </section>
        </div>
      );
};


export default EventsDetailsPage;