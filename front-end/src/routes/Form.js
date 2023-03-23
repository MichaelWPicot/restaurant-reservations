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


    <div >
      <form onSubmit={formSubmit}>
        <div >
          <div >
            <label
          
              htmlFor="grid-first-name"
            >
              First Name
            </label>
            <input
              name="first_name"
           
              id="first_name"
              type="text"
              value={reservation.first_name}
              placeholder={initialState.first_name ? initialState.first_name : "First Name"}
              onChange={(e) => changeHandler(e)}
              required
            />
          
          </div>
          <div >
            <label
         
              htmlFor="grid-last-name"
            >
              Last Name
            </label>
            <input
              name="last_name"
            
              id="last-name"
              type="text"
              value={reservation.last_name}
              placeholder="Last Name"
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
        </div>
        <div >
          <div>
            <label
            
              htmlFor="grid-mobile-number"
            >
              Mobile Number
            </label>
            <input
            
              placeholder="000-000-0000"
              name="mobile_number"
              type="tel"
              id="mobile_number"
              value={reservation.mobile_number}
              onChange={(e) => changeHandler(e)}
              required
            />
            <p >
              Please use the format 000-000-0000{" "}
            </p>
          </div>
          <div >
            <label
            
              htmlFor="grid-mobile-people"
            >
              Party Size
            </label>
            <input
              
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
        <div >
          <div >
            <label
      
              htmlFor="grid-reservation-date"
            >
              Reservation Date
            </label>
            <input
              name="reservation_date"
             
              id="date"
              type="date"
              value={reservation.reservation_date}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div >
            <label
           
              htmlFor="grid-reservation-time"
            >
              Reservation Time
            </label>
            <input
              name="reservation_time"
    
              type="time"
              value={reservation.reservation_time}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
        </div>
        <div >
          <div >
            <button
           
              type="submit"
            >
              Submit
            </button>
            </div>
            <div>
              <button
              
                
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