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
        const inputTime = reservation.reservation_time.split(":");
        const today = new Date();
        const inputDate = new Date(`${reservation.reservation_date}T${reservation.reservation_time}:00.000Z`);
        console.log(reservation.reservation_time, reservation.reservation_date, today)
        const mobileValidator = reservation.mobile_number.split("-");
        if (mobileValidator.length===3){
          if (parseInt(mobileValidator[0].toString()!==mobileValidator[0]||mobileValidator[0].length!==3)){
            throw new Error("Input mobile number in the following format before submitting 000-000-0000")
          } else if (parseInt(mobileValidator[1].toString()!==mobileValidator[1]||mobileValidator[1].length!==3)){
            throw new Error( "Input mobile number in the following format before submitting 000-000-0000")
          } else if (parseInt(mobileValidator[2].toString()!==mobileValidator[2]||mobileValidator[2].length!==4)) {
            throw new Error("Input mobile number in the following format before submitting 000-000-0000")
          }
        } else if (mobileValidator.length!==1||mobileValidator[0].length!==10){
          throw new Error("Input mobile number in the following format before submitting 000-000-0000");
        } else if (inputDate.getDate()===2){
          throw new Error("Reservation Date must not be on a Tuesday")
        } else if (
           Date.parse(today.toISOString()) > Date.parse(inputDate)
        ){
          throw new Error("Reservation Date must not be in the past")
        }
        else if (
          parseInt(inputTime.join(""))<1030
        ){
          throw new Error("Reservation Time must not be after 10:30 am")
        }else if (
          parseInt(inputTime.join(""))>2200
        ){
          throw new Error("Reservation Time must be before 10:00 pm")
        }
        else {
          let date = reservation.reservation_date
          setReservation(initialState)
          history.push(`/dashboard?date=${date}`)
        
        await createReservation(reservation, abortController.signal)
        }
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