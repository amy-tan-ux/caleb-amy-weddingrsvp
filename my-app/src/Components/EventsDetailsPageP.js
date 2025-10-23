import "./style/DetailsDisplay.css";

const EventsDetailsPagePrivate = ({title, schedule, location, note, locationlink}) => {
    return (
        <div className="wedding-container">
          <h1 className="rose-gold-title">{title}</h1>
          <p className="story-text">
          {schedule} at <a href={locationlink}> {location}</a>
          </p>
          <p className="story-text">
            {note}
          </p>
          <iframe src={locationlink} width="600" height="450" style={{border:0}} loading="lazy" referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          <br/>
        </div>
      );
};


export default EventsDetailsPagePrivate;