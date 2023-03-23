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
        <td className="p-2 m-2">{reservation_id}</td>
        <td className="p-2 m-2">{reservation.first_name}</td>
        <td className="p-2 m-2">{reservation.last_name}</td>
        <td className="p-2 m-2">{reservation.mobile_number}</td>
        <td className="p-2 m-2">
          {formatAsDate(reservation.reservation_date)}
        </td>
        <td className="p-2 m-2">
          {formatAsTime(reservation.reservation_time)}
        </td>
        <td className="mb-2">{reservation.people}</td>
        <td className="p-2 m-2">{reservation.status}</td>
        <td className="p-2 m-2">
          <div className="mt-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              Edit
            </a>
          </div>
        </td>
        <td>
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={(e) => handleCancelClick(e, reservation.reservation_id)}
            className="mt-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="p-8 container text-center ">
      <h3 className="text-3xl p-8 font-Staatliches">Find a reservation</h3>
      <form onSubmit={submitSearch} className="flex flex-col items-center justify-center">
        <input
          className="appearance-none w-1/3 bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-8 leading-tight focus:outline-none focus:bg-white"
          name="mobile_number"
          type="text"
          id="mobile_number"
          value={number}
          onChange={changeHandler}
          placeholder="Enter a phone number"
        />
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mb-20"
          type="submit"
        >
          Find
        </button>
      </form>
      <ErrorAlert error={error} />
      <h4 className="text-center text-4xl mb-4 font-Staatliches">{`Reservations for ${number}`}</h4>
      <div className="container flex justify-center mx-auto mb-20">
        <div className="overflow-auto flex flex-col">
          <div className="w-full">
            <div className="border-b border-gray-200 shadow">
              <table className="text-center text-xl divide-y divide-gray-300 ">
                <thead className="font-Inconsolata bg-gray-50">
                  <tr>
                    <th className="px-6 py-2 text-l text-gray-500">ID</th>
                    <th className="px-6 py-2 text-l text-gray-500">
                      First name
                    </th>
                    <th className="px-6 py-2 text-l text-gray-500">
                      Last Name
                    </th>
                    <th className="px-6 py-2 text-l text-gray-500">
                      Mobile Number
                    </th>
                    <th className="px-6 py-2 text-l text-gray-500">Date</th>
                    <th className="px-6 py-2 text-l text-gray-500">Time</th>
                    <th className="px-6 py-2 text-l text-gray-500">
                      Party Size
                    </th>
                    <th className="px-6 py-2 text-l text-gray-500">Status</th>
                    <th className="px-6 py-2 text-l text-gray-500">Edit</th>

                    <th className="px-6 py-2 text-l text-gray-500">Cancel</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300 font-Inconsolata">
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