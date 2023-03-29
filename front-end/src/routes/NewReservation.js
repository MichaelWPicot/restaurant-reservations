import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Form from "./Form"

function NewReservation() {
  const initialState = {
    "first_name": "",
    "last_name": "",
    "mobile_number": "",
    "reservation_date": "",
    "reservation_time": "",
    "people": 0,
  };

  const history = useHistory();
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(initialState);

  
  async function submitHandler(e, reservation) {
  reservation.people = Number(reservation.people)
    e.preventDefault();
    let abortController = new AbortController();
    async function newReservation() {
      try {
     
        let mobileValidator = reservation.mobile_number.split("-");
        if (mobileValidator.length===3){
          if (parseInt(mobileValidator[0].toString()!==mobileValidator[0]||mobileValidator[0].length!==3)){
            throw "Input mobile number in the following format before submitting 000-000-0000"
          } else if (parseInt(mobileValidator[1].toString()!==mobileValidator[1]||mobileValidator[1].length!==3)){
            throw "Input mobile number in the following format before submitting 000-000-0000"
          } else if (parseInt(mobileValidator[2].toString()!==mobileValidator[2]||mobileValidator[2].length!==4)) {
            throw "Input mobile number in the following format before submitting 000-000-0000"
          }
        } else if (mobileValidator.length!==1||mobileValidator[0].length!==10){
          throw "Input mobile number in the following format before submitting 000-000-0000"
        } else {
          let date = reservation.reservation_date
          setReservation(initialState)
          history.push(`/dashboard?date=${date}`)
        }
        await createReservation(reservation, abortController.signal)
      } catch (error) {
        setError(error);
      }
    }
    newReservation();
    return () => {
      abortController.abort();
    };
  }

  return (
    <div>
    <ErrorAlert error={error} /> 
    <Form initialState={reservation} submitHandler={submitHandler} />
    </div>
  );
}

export default NewReservation;