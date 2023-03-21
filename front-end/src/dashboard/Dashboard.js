import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {
  previous,
  next,
  today,
  formatAsTime,
  formatAsDate,
} from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  if (!date){
   date=today();
  }
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  function loadTables() {
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal).then(setTables).catch(setReservationsError);
    return () => abortController.abort();
  }
  const history = useHistory();

  function pushDate(dateToMove) {
    history.push(`/dashboard?date=${dateToMove}`);
  }

  function handleClick(nextOrPrev) {
    pushDate(nextOrPrev);
  }

  async function handleCancelClick(e, reservation_id) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone"
      )
    ) {
      const abortController = new AbortController();
      await updateStatus(reservation_id, "cancelled", abortController.signal);
      history.push("/");
      return () => abortController.abort();
    }
  }
  // let filteredReservations = reservations.filter((reservation) => {
  //   return (
  //     reservation.status !== "finished" && reservation.status !== "cancelled"
  //   );
  // });

  const displayReservations = reservations.map((reservation) => {
    const { reservation_id } = reservation;
    return (
      <tr
        key={reservation.reservation_id}
        className="p-2 m-4 hover:bg-gray-300"
      >
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
        <td
          data-reservation-id-status={reservation.reservation_id}
          className="p-2 m-1"
        >
          {reservation.status}
        </td>
        <td className="p-2 m-2">
          <div className="mt-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              Edit
            </a>
          </div>
        </td>
        <td className="p-2 m-2">
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={(e) => handleCancelClick(e, reservation.reservation_id)}
            className="mt-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            Cancel
          </button>
        </td>
        <td className="p-2 m-2">
          {reservation.status === "booked" ? (
            <div className="mt-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              <a href={`/reservations/${reservation_id}/seat`}>Seat</a>
            </div>
          ) : null}
        </td>
      </tr>
    );
  });

 let displayTables = tables.map((table) => {
    console.log(table);
    return (
      <tr
        className="p-2 m-2 hover:bg-gray-300 bg-gray-200"
        key={table.table_id}
      >
        <td className="p-2 m-2">{table.table_id}</td>
        <td className="p-2 m-2">{table.table_name}</td>
        <td className="p-2 m-2">{table.capacity}</td>
        <td className="p-2 m-2" data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}
        </td>
        <td>
          {table.reservation_id ? <p></p> : null}
        </td>
      </tr>
    );
  });

  return (
    <main className="min-h-screen font-Staatliches">
      <h1 className="text-center text-6xl p-10">Dashboard</h1>
      <ErrorAlert error={reservationsError} />
      <div className="flex flex-col">
        <div className="p-4 m-5 ">
          <h4 className="text-center text-4xl mb-4">{`Reservations for ${date}`}</h4>
          <div className="container flex justify-center mx-auto">
            <div className="overflow-auto flex flex-col">
              <div className="w-full">
                <div className=" border-b border-gray-200 shadow">
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
                        <th className="px-6 py-2 text-l text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-2 text-l text-gray-500">Edit</th>

                        <th className="px-6 py-2 text-l text-gray-500">
                          Cancel
                        </th>
                        <th className="px-6 py-2 text-l text-gray-500">Seat</th>
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
        <div className="p-4 m-5">
          <h1 className="text-4xl text-center"> Tables</h1>
          <br></br>
          <div className="container flex justify-center mx-auto">
            <div className="flex flex-col">
              <div className="w-full">
                <div className="border-b border-gray-200 shadow">
                  <table className="text-center text-xl divide-y divide-gray-300 ">
                    <thead className="font-Inconsolata bg-gray-50">
                      <tr>
                        <th className="px-6 py-2 text-l text-gray-500">ID</th>
                        <th className="px-6 py-2 text-l text-gray-500">
                          Table Name
                        </th>
                        <th className="px-6 py-2 text-l text-gray-500">
                          Capacity
                        </th>
                        <th className="px-6 py-2 text-l text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-2 text-l text-gray-500">
                          Open Table
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-Inconsolata">{displayTables}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="m-auto pb-20">
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            type="button"
            onClick={(e) => handleClick(previous(date))}
          >
            Previous
          </button>
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            type="button"
            onClick={(e) => handleClick(today())}
          >
            Today
          </button>
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            type="button"
            onClick={(e) => handleClick(next(date))}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
