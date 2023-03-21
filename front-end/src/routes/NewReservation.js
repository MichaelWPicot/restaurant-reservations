import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {createReservation} from "../utils/api";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function NewReservation({ date }) {
  let history = useHistory();
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });

  // useEffect(loadDashboard, [date]);
  function handleChange({ target: { name, value } }) {
    if (name==="people"){
      value = parseInt(value)
    }
    setReservation({
      ...reservation,
      [name]: value,
    });
  }
  function cancelClick() {
    history.goBack();
  }
  function reservationSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    createReservation(reservation, abortController.signal)
      .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <span>
    <ErrorAlert error={error} />
    <form onSubmit={reservationSubmit}>
      <label>
        First Name:
        <input
          type="text"
          name="first_name"
          value={reservation.first_name}
          onChange={handleChange}
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="last_name"
          value={reservation.last_name}
          onChange={handleChange}
        />
      </label>
      <label>
        Mobile Number:
        <input
          type="text"
          name="mobile_number"
          value={reservation.mobile_number}
          onChange={handleChange}
        />
      </label>
      <label>
        Date of reservation:
        <input
          type="date"
          name="reservation_date"
          placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}"
          value={reservation.reservation_date}
          onChange={handleChange}
        />
      </label>
      <label>
        Time of reservation:
        <input
          type="time"
          name="reservation_time"
          placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}"
          value={reservation.reservation_time}
          onChange={handleChange}
        />
      </label>
      <label>
        Party Size:
        <input
          type="number"
          name="people"
          value={reservation.people}
          onChange={handleChange}
          min="1"
        />
      </label>
      <div>
            <button
              type="submit"
            >
              Submit
            </button>
      </div>
      <button type="button" onClick={cancelClick}>
        Cancel
      </button>
    </form>
    </span>
  );
}

export default NewReservation;
