import {useEffect, useState} from "react";
import {postGuestRSVPDetails} from '../Scripts/googleDataInterface';
import '../App.css';

const RsvpFormP = ({FormValues, GuestName, RsvpStatus, GuestCode}) =>{
    const [formInput, setFormInput] = useState({});
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState(false);
    const [freezeForm, setFreezeForm] = useState(false);

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
        <h1>RSVP</h1><br/>
        <h3>Hi {GuestName}, </h3>
        <br/> 
        {formSubmitStatus && <h5>Thank you for submitting your RSVP, you can always come back to make any changes to response anytime before February 15, 2026.</h5>}
        {!formSubmitStatus && RsvpStatus && <h5>You've already made an RSVP but if there are any changes you wish to make in your previous response, you can submit another response below before February 15, 2026!</h5>}
        {!formSubmitStatus && !RsvpStatus && <h5>Please RSVP below. Due to logistics and planning we kindly ask you to complete the RSVP before February 15, 2026. </h5>}
        {submitErrorMessage && <p style={{color: "red"}}>Failed to Submit Your Response. Please Try Again Later.</p>}
        <br/>
        { !formSubmitStatus && 
        <form onSubmit={getRSVPDetails}>
        {FormValues.map((field) => (
        <div key={field["fieldname"]}> 
            {/* Dynamic generation of form fields and input depending on 
            input type, fieldname,label, classname, placeholder, description, value*/}

            {!(field["label"]=="Email") && <h5>{field["label"]}</h5>}
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