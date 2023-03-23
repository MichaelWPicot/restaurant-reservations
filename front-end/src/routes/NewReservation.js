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
        await createReservation(reservation, abortController.signal)
        let date = reservation.reservation_date
        setReservation(initialState)
        history.push(`/dashboard?date=${date}`)
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