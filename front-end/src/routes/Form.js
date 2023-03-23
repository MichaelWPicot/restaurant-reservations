import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function NewReservations({
  initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  },
  submitHandler,
}) {
  const history = useHistory();
  const [reservation, setReservation] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setReservation((res) => ({
      ...res,
      [name]: value,
    }));
  }

  function formSubmit(e) {
    e.preventDefault();
    submitHandler(e, reservation);
  }

  return (


    <div className="mt-20 w-full min-h-screen container flex justify-center mx-auto">
      <form className="mt-20 form max-w-lg" onSubmit={formSubmit}>
        <div className="flex flex-wrap mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              First Name
            </label>
            <input
              name="first_name"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="first_name"
              type="text"
              value={reservation.first_name}
              placeholder={initialState.first_name ? initialState.first_name : "First Name"}
              onChange={(e) => changeHandler(e)}
              required
            />
            <p className="text-red-500 text-xs italic">
              Please fill out this field.
            </p>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Last Name
            </label>
            <input
              name="last_name"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="last-name"
              type="text"
              value={reservation.last_name}
              placeholder="Last Name"
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-mobile-number"
            >
              Mobile Number
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              placeholder="000-000-0000"
              name="mobile_number"
              type="tel"
              id="mobile_number"
              value={reservation.mobile_number}
              onChange={(e) => changeHandler(e)}
              required
            />
            <p className="text-gray-600 text-xs italic">
              Please use the format 000-000-0000{" "}
            </p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-mobile-people"
            >
              Party Size
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="people"
              id="people"
              type="number"
              min="0"
              value={reservation.people}
              placeholder="1"
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-reservation-date"
            >
              Reservation Date
            </label>
            <input
              name="reservation_date"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="date"
              type="date"
              value={reservation.reservation_date}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-reservation-time"
            >
              Reservation Time
            </label>
            <input
              name="reservation_time"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="time"
              type="time"
              value={reservation.reservation_time}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap mx-3 my-20 ">
          <div className="text-center w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full md:w-1/2 px-3 mb-6 md:mb-0"
              type="submit"
            >
              Submit
            </button>
            </div>
            <div className="text-center w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <button
              
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full md:w-1/2 px-3 mb-6 md:mb-0"
                type="button"
                onClick={(e) => history.goBack()}
              >
                Cancel
              </button>
            </div>
          </div>
      </form>
    </div>
  );
}

export default NewReservations;