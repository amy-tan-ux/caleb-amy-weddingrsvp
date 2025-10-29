import "./style/DetailsDisplay.css";

const EventsDetailsPagePrivate = ({title, schedule, location, note, locationlink}) => {
    return (
        <div className="wedding-container">
          <h1 className="rose-gold-title">{title}</h1>
          <div className="story-text">
          {schedule} at {location}
          </div>
          <p className="story-text">
            {note}
          </p>
          <br/>
          <iframe src={locationlink} loading="lazy" referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          <br/>
        </div>
      );
};


export default EventsDetailsPagePrivate;