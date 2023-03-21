import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateTables, listTables } from "../utils/api";

function AssignSeat() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectTable, setSelectTable] = useState({});
  const { reservation_id } = useParams();

  function changeHandler({ target: { name, value } }) {
    setSelectTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  useEffect(loadTables, []);

   function loadTables() {
    const abortController = new AbortController();
    setError(null);
   listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }

  function submitHandler(e) {
    e.preventDefault();
    let abortController = new AbortController();
    async function assignTable() {
      try {
        await updateTables(reservation_id, selectTable.table_id, abortController.signal);
        history.push(`/dashboard`);
      } catch (error) {
        setError(error);
      }
    }
    assignTable();
    return () => {
      abortController.abort();
    };
  }

  const tableOptions = tables.map((table) => {
    return (
      <option value={table.table_id} key={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <div>
  
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler}>
        
        <label htmlFor="tables">Assign Table:</label>
        <div >
        <select name="table_id" onChange={changeHandler}
        required>
          <option value=""> -- Please select a table -- </option>
          {tableOptions}
        </select>
        </div>
        <div>
        <button
          type="submit"
        >
          Submit
        </button>
        <button type="button" onClick={(e) => history.goBack()}>
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
}

export default AssignSeat;