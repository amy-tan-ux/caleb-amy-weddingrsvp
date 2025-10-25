import {useEffect, useState} from "react";
import {postGuestRSVPDetails} from '../Scripts/googleDataInterface';
import '../App.css';

const RsvpFormP = ({FormValues, GuestName, RsvpStatus, GuestCode}) =>{
    const [formInput, setFormInput] = useState({});
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState(false);
    const [freezeForm, setFreezeForm] = useState(false);
    const [showDuck, setShowDuck] = useState(false);

    useEffect(() => {
      if (FormValues){
        FormValues.forEach((field) => {
        setFormInput( prevFormInput =>({ ...prevFormInput, [field["fieldname"]]: field["placeholder"]}))});
      }},[FormValues]);
    
    const getRSVPDetails = async (e) => {
          e.preventDefault();
          // Save Guest Name
          setFormInput( prevFormInput =>({ ...prevFormInput, "name": GuestName}));
          try {
            setFreezeForm(true);
            const response = await postGuestRSVPDetails(GuestCode, formInput);
            setFormSubmitStatus(true); // Submitted 
            setSubmitErrorMessage(false);
          } catch (error) {
            console.error('Submission error:', error);
            setFormSubmitStatus(false);
            setSubmitErrorMessage(true); // Failed to Submit
            setTimeout(() => setSubmitErrorMessage(false), 5000); // Hide message after 5 seconds
          }finally{
                setFreezeForm(false);
          }

    }

    return (
    <div className="form-container">
         {showDuck && <img
            src="https://media.tenor.com/yRSnf6wABQ4AAAAi/pato-duck.gif"
            alt="Duck Overlay"
            className="overlay-image"></img>}
        <h1>RSVP</h1>
        <br/>
        <h3>Dear {GuestName}, </h3>
        <br/> 
        {formSubmitStatus && <h4>Thank you for submitting your response, you can always come back to make any changes to response anytime before February 15, 2026.</h4>}
        {!formSubmitStatus && RsvpStatus && <h4>You've already submitted a response but if there are any changes you would like to make, you can submit another one before February 15, 2026.</h4>}
        {!formSubmitStatus && !RsvpStatus && <h4>Please RSVP below. We kindly ask you to complete the form by February 15, 2026. </h4>}
        {submitErrorMessage && <p style={{color: "red"}}>Failed to Submit Your Response. Please Try Again Later.</p>}
        <br/>
        { !formSubmitStatus && 
        <form onSubmit={getRSVPDetails}>
        {FormValues.map((field) => (
        <div key={field["fieldname"]}> 
            {/* Dynamic generation of form fields and input depending on 
            input type, fieldname,label, classname, placeholder, description, value*/}

            {!(field["label"]=="Email") && <h4>{field["label"]}</h4>}
            <p>{field["description"]}</p>
            {!field["value"] && <> <label key= {field["value"]}><input type={field["type"]} name={field["fieldname"]} placeholder={field["placeholder"]} className={field["classname"]} 
                     onChange={(e) => {
                        setFormInput( prevFormInput =>({ ...prevFormInput, [field["fieldname"]]: e.target.value}));
                        }}
                        readOnly= {freezeForm}
                        style={{backgroundColor: freezeForm ? "#c1c1c1ff" : "white"}}/></label></>}
            {field["value"] && field["value"].map((option) => ( // radio button
                    <label key= {field["value"]+ option}>
                        <input
                            type="radio"
                            name={option}
                            value={option}
                            checked={( !formInput[field["fieldname"]]  && field["placeholder"]===option) | ( formInput[field["fieldname"]]  && formInput[field["fieldname"]] === option) }
                            onChange={(e) => {
                              if(option.includes("duck")){
                                setShowDuck(true);
                                setTimeout(() => setShowDuck(false), 3000); // show duck for three second
                              }
                               setFormInput( prevFormInput =>({ ...prevFormInput, [field["fieldname"]]: option}));
                            }}
                            readOnly= {freezeForm}
                            style={{backgroundColor: freezeForm ? "#c1c1c1ff" : "white"}}/>
                        {option} <br/>
                    </label>
                ))}
            <br/>
        </div>))}
        <br/><br/>
        <button type="submit" className="btn" onClick={getRSVPDetails}>RSVP</button>
        <br/><br/>
        </form>}
        </div>);
    
};

export default RsvpFormP;