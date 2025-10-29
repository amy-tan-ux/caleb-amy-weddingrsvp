import "./style/DetailsDisplay.css"; // Optional CSS for styling

const savemusic = async (e) => {
          e.preventDefault();
    }

const EventsDetailsPage = () => {
    return (
        <div>
          <section class="icon-section">
          <a href="#details" class="icon-link">
            <img src="" alt="RSVP Details" />
          </a>
          <div class="icon-link">
            <img src="" alt="Dress Code" />
          </div>
          <div class="icon-link">
            <img src="" alt="Colour Scheme" />
          </div>
          <a href="#music-message" class="icon-link">
            <img src="" alt="Song Request" />
          </a>
          <a href="#music-message" class="icon-link">
            <img src="" alt="Message to Couple" />
          </a>
        </section>
        </div>
      );
};


export default EventsDetailsPage;