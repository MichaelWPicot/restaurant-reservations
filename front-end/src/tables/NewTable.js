import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTables } from "../utils/api";
import { today } from "../utils/date-time";

function CreateTables() {
  const initialState = {
    table_name: "",
    capacity: 0,
  };

  const history = useHistory();
  const [error, setError] = useState(null);
  const [table, setTable] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function changeHandlerNum({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: Number(value),
    }));
  }

  function submitHandler(e) {
    table.capacity = Number(table.capacity);
    e.preventDefault();
    let abortController = new AbortController();
    async function newTable() {
      try {
        await createTables(table, abortController.signal);
        //let date = reservation.reservation_date
        setTable(initialState);
        history.push(`/dashboard?date=${today()}`);
      } catch (error) {
        setError(error);
      }
    }
    newTable();
    return () => {
      abortController.abort();
    };
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <div>
        <form
          onSubmit={(e) => submitHandler(e)}
        >
          <div>
            <div>
              <label
                htmlFor="grid-first-name"
              >
                Table Name
              </label>
              <input
                name="table_name"
                id="table-name"
                type="text"
                value={table.table_name}
                placeholder="Table Name"
                onChange={(e) => changeHandler(e)}
                required
              />
              <p className="text-red-500 text-xs italic">
                Please fill out this field.
              </p>
            </div>
            <div>
              <label
                htmlFor="grid-mobile-people"
              >
                Party Size
              </label>
              <input
                name="capacity"
                id="capacity"
                type="number"
                min={1}
                value={table.capacity}
                placeholder="1"
                onChange={(e) => changeHandlerNum(e)}
                required
              />
            </div>
          </div>
          <div>
            <div>
              <button
                type="submit"
              >
                Submit
              </button>
            </div>
            <div >
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
    </div>
  );
}

export default CreateTables;