import React, { useState } from "react";
import { search, updateStatus } from "../utils/api";
import { formatAsTime, formatAsDate } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState([]);
  function changeHandler({ target: { value } }) {
    setNumber(value);
  }

  function submitSearch(e) {
    e.preventDefault();
    const abortController = new AbortController();
    setError(null);
    setReservations([]);
    search(number, abortController.signal)
      .then((response) => {
        if (response.length) {
          return setReservations(response);
        } else {
          setError({ message: "No reservations found." });
        }
      })
      .catch(setError);
    return () => abortController.abort();
  }

  async function handleCancelClick(e, reservation_id) {
    if (
      window.confirm(
        "Do you wish to cancel this reservation? This cannot be undone"
      )
    ) {
      const abortController = new AbortController();
      await updateStatus(reservation_id, "cancelled", abortController.signal);
      // history.goBack()
      return () => abortController.abort();
    }
  }
  const displayReservations = reservations.map((reservation) => {
    const { reservation_id } = reservation;
    return (
      <tr key={reservation_id} className="p-2 m-4 hover:bg-gray-300">
        <td >{reservation_id}</td>
        <td >{reservation.first_name}</td>
        <td >{reservation.last_name}</td>
        <td >{reservation.mobile_number}</td>
        <td >
          {formatAsDate(reservation.reservation_date)}
        </td>
        <td >
          {formatAsTime(reservation.reservation_time)}
        </td>
        <td >{reservation.people}</td>
        <td >{reservation.status}</td>
        <td >
          <div >
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              Edit
            </a>
          </div>
        </td>
        <td>
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={(e) => handleCancelClick(e, reservation.reservation_id)}

          >
            Cancel
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div >
      <div >
      <h3 >Find a reservation</h3>
      <form onSubmit={submitSearch}>
        <input
          
          name="mobile_number"
          type="text"
          id="mobile_number"
          value={number}
          onChange={changeHandler}
          placeholder="Enter a phone number"
        />
        <button
      
          type="submit"
        >
          Find
        </button>
      </form>
      <ErrorAlert error={error} />
      <h4 >{`Reservations for ${number}`}</h4>
      <div >
        <div >
          <div >
            <div >
              <table >
                <thead >
                  <tr>
                    <th >ID</th>
                    <th >
                      First name
                    </th>
                    <th >
                      Last Name
                    </th>
                    <th >
                      Mobile Number
                    </th>
                    <th >Date</th>
                    <th >Time</th>
                    <th >
                      Party Size
                    </th>
                    <th >Status</th>
                    <th >Edit</th>

                    <th >Cancel</th>
                  </tr>
                </thead>
                <tbody >
                  {displayReservations}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Search;