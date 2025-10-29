import "./style/DetailsDisplay.css"; // Optional CSS for styling

const savemusic = async (e) => {
          e.preventDefault();
    }

const EventsDetailsPage = () => {
    return (
        <div>
          <section class="icon-section">
          <a href="#details" class="icon-link">
            <img src="details-icon.png" alt="RSVP Details" />
          </a>
          <div class="icon-link">
            <img src="story-icon.png" alt="Dress Code" />
          </div>
          <div class="icon-link">
            <img src="rsvp-icon.png" alt="Colour Scheme" />
          </div>
        <a href="#details" class="icon-link optional">
            <img src="details-icon.png" alt="RSVP Details" />
          </a>
          <a href="#details" class="icon-link optional">
            <img src="details-icon.png" alt="RSVP Details" />
          </a>
        </section>
        </div>
      );
};


export default EventsDetailsPage;