import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import Occupied from "./Occupied";

import {
  previous,
  next,
  today,
  formatAsTime,
  formatAsDate,
} from "../utils/date-time";

function Dashboard({ date }) {
  const query = useQuery();
  const getDate = query.get("date");

  if (getDate) {
    date = getDate;
  } else {
    date = today();
  }

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState([]);

  useEffect(loadReservations, [date]);
  useEffect(loadTables, []);

  function loadReservations() {
    const abortController = new AbortController();
    setError(null);
    listReservations(date, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);
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
  let filteredReservations = reservations.filter((reservation) => {
    return (
      reservation.status !== "finished" && reservation.status !== "cancelled"
    );
  });

  const displayReservations = filteredReservations.map((reservation) => {
    const { reservation_id } = reservation;
    return (
      <tr key={reservation.reservation_id}>
        <td>{reservation_id}</td>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{formatAsDate(reservation.reservation_date)}</td>
        <td>{formatAsTime(reservation.reservation_time)}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td>
          <div>
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
        <td>
          {reservation.status === "booked" ? (
            <div>
              <a href={`/reservations/${reservation_id}/seat`}>Seat</a>
            </div>
          ) : null}
        </td>
      </tr>
    );
  });

  let displayTables = tables.map((table) => {
    return (
      <tr key={table.table_id}>
        <td>{table.table_id}</td>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}
        </td>
        <td>
          {table.reservation_id ? <Occupied table_id={table.table_id} /> : null}
        </td>
      </tr>
    );
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={error} />
      <div>
        <div>
          <h4>{`Reservations for ${date}`}</h4>
          <div>
            <div>
              <div>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>First name</th>
                        <th>Last Name</th>
                        <th>Mobile Number</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Party Size</th>
                        <th>Status</th>
                        <th>Edit</th>

                        <th>Cancel</th>
                        <th>Seat</th>
                      </tr>
                    </thead>
                    <tbody>{displayReservations}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1> Tables</h1>
          <br></br>
          <div>
            <div>
              <div>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Table Name</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th>Open Table</th>
                      </tr>
                    </thead>
                    <tbody>{displayTables}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button type="button" onClick={(e) => handleClick(previous(date))}>
            Previous
          </button>
          <button type="button" onClick={(e) => handleClick(today())}>
            Today
          </button>
          <button type="button" onClick={(e) => handleClick(next(date))}>
            Next
          </button>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
